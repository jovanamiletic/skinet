using System;
using System.Security.Claims;
using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
  [HttpGet("unauthorized")]
  public IActionResult GetUnauthorized() //401 Unauthorized → nisi ulogovana / nema tokena
  {
    return Unauthorized();
  }

  [HttpGet("badrequest")]
  public IActionResult GetBadRequest() //400 Bad Request → nešto nije u redu sa zahtevom (validacija, loš format)
  {
    return BadRequest("Not a good request");
  }

  [HttpGet("notfound")]
  public IActionResult GetNotFound() //404 Not Found → traženi resurs ne postoji
  {
    return NotFound();
  }

  [HttpGet("internalerror")]
  public IActionResult GetInternalError() //500 Internal Server Error → puklo je nešto na serveru
  {
    throw new Exception("This is a test exception");
  }

  [HttpPost("validationerror")]
  public IActionResult GetValidationError(CreateProductDto product) //(400 Validation error kao poseban slučaj 400 gde dobijaš listu grešaka po poljima)
  {
    return Ok();
  }

  [Authorize] //ako request nema validan auth cookie (ili token) → API vraća 401 Unauthorized
  [HttpGet("secret")]
  public IActionResult GetSecret()
  {
    var name = User.FindFirst(ClaimTypes.Name)?.Value; //User u kontroleru dolazi iz cookie-ja i nosi claims
    var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    return Ok("Hello " + name + " with the id of " + id);
  }

  [Authorize(Roles = "Admin")]
  [HttpGet("admin-secret")]
  public IActionResult GetAdminSecret()
  {
    var name = User.FindFirst(ClaimTypes.Name)?.Value;
    var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var isAdmin = User.IsInRole("Admin");
    var roles = User.FindFirstValue(ClaimTypes.Role);

    return Ok(new
    {
      name,
      id,
      isAdmin,
      roles
    });
  }

}
