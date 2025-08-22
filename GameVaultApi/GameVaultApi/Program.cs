using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using GameVaultApi.Data;
using GameVaultApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<GameVaultDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("GameVaultDb"))
);

// Configuration JWT avec valeurs par d�faut pour le d�veloppement
var jwtSettings = builder.Configuration.GetSection("AppSettings");
var secretKey = jwtSettings["Token"] ?? "ma-cl�-secr�te-de-d�veloppement-tr�s-longue-et-s�curis�e";
var issuer = jwtSettings["Issuer"] ?? "GameVaultApi";
var audience = jwtSettings["Audience"] ?? "GameVaultClient";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IGameService, GameService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // React dev servers
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Important for HttpOnly cookies
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
