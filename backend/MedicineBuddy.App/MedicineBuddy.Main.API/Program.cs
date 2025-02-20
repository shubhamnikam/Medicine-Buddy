
using System.Configuration;
using MedicineBuddy.Main.API.Extensions;
using MedicineBuddy.Main.API.Options;
using MedicineBuddy.Main.API.Repositories;
using MedicineBuddy.Main.API.Services;

namespace MedicineBuddy.Main.API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.AddServiceDefaults();
        //add cors
        const string CORS_POLICY_NAME = "allow_all";
        builder.Services.AddCors((options) =>
        {
            options.AddPolicy(CORS_POLICY_NAME,
                policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
        });


        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddOpenApi();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // option pattern
        builder.Services.Configure<AppAuthOptions>(builder.Configuration.GetSection("AuthTokenSettings"));

        // register JWT auth per request validator
        builder.Services.JwtAuthRequestValidate(builder.Configuration);


        // repositories DI
        builder.Services.AddScoped<IDbConnectionRepository, DbConnectionRepository>();
        builder.Services.AddScoped<IAuthRepository, AuthRepository>();
        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IHomeRepository, HomeRepository>();

        // services DI
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IHomeService, HomeService>();


        var app = builder.Build();
        app.UseCors(CORS_POLICY_NAME);

        app.MapDefaultEndpoints();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
