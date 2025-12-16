using API.Middleware;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

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
builder.Services.AddCors();
builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
{
  var connString = builder.Configuration.GetConnectionString("Redis") ?? throw new Exception("Cannot get redis connection string");
  var configuration = ConfigurationOptions.Parse(connString, true);
  return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddSingleton<ICartService, CartService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200"));

app.MapControllers();

try
{
  using var scope = app.Services.CreateScope(); // using garantuje da će se scope (i DbContext) pravilno dispose-ovati
  var services = scope.ServiceProvider;
  var context = services.GetRequiredService<StoreContext>(); // DI pravi instancu StoreContext
  await context.Database.MigrateAsync(); // da li baza postoji -> ako ne, kreira je; proverava koje migracije su vec primenjene, a onda primenjuje sve one koje fale
  await StoreContextSeed.SeedAsync(context);
}
catch (Exception ex)
{
  Console.WriteLine(ex);
  throw;
}

app.Run();
