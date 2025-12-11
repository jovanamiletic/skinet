namespace API.Errors;

//ApiErrorResponse je DTO koji standardizuje način na koji API šalje greške ka klijentu
public class ApiErrorResponse(int statusCode, string message, string? details)
{
  public int StatusCode { get; set; } = statusCode;
  public string Message { get; set; } = message;
  public string? Details { get; set; } = details;
}
