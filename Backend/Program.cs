using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configurar Forwarded Headers (útil en plataformas que usan proxy / TLS termination)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // options.KnownProxies / options.KnownNetworks pueden configurarse si necesitas seguridad adicional
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendOnly", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Escuchar en el PORT que asigna la plataforma (Render)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5089";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

// Aplicar forwarded headers antes de leer scheme/origin
app.UseForwardedHeaders();

// Middleware opcional de logging para depuración (puedes quitar en producción)
app.Use(async (context, next) =>
{
    Console.WriteLine($"[{DateTime.UtcNow:O}] {context.Connection.RemoteIpAddress} {context.Request.Method} {context.Request.Path}");
    await next();
});

app.UseRouting();

// Aplicar CORS
app.UseCors("AllowFrontendOnly");

// Mapear controllers
app.MapControllers();

app.Run();