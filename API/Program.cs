using API.Middleware;
using Core.Interfaces;
using Core.Entities;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using API.SignalR;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
  opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
// type of the lifetime of the service

// builder.Services.AddSingleton - od pokretanja aplikacije do njenog gasenja
// builder.Services.AddScoped - duzina HTTP request-a
// builder.Services.AddTransient - duzina trajanja metode


builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddCors();
builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
{
  var connString = builder.Configuration.GetConnectionString("Redis") ?? throw new Exception("Cannot get redis connection string");
  var configuration = ConfigurationOptions.Parse(connString, true);
  return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddSingleton<ICartService, CartService>();

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>().AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<StoreContext>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200", "https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<AppUser>(); //Microsoft-ovi default endpointi (/login, /register, …) sada dobiju prefiks /api => POST /api/login

app.MapHub<NotificationHub>("/hub/notifications");

try
{
  using var scope = app.Services.CreateScope(); // using garantuje da će se scope (i DbContext) pravilno dispose-ovati
  var services = scope.ServiceProvider;
  var context = services.GetRequiredService<StoreContext>(); // DI pravi instancu StoreContext
  var userManager = services.GetRequiredService<UserManager<AppUser>>();
  await context.Database.MigrateAsync(); // da li baza postoji -> ako ne, kreira je; proverava koje migracije su vec primenjene, a onda primenjuje sve one koje fale
  await StoreContextSeed.SeedAsync(context, userManager);
}
catch (Exception ex)
{
  Console.WriteLine(ex);
  throw;
}

app.Run();
