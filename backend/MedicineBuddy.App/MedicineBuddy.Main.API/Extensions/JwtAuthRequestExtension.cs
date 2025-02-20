using MedicineBuddy.Main.API.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MedicineBuddy.Main.API.Extensions;

public static class JwtAuthRequestExtension
{
    public static IServiceCollection JwtAuthRequestValidate(this IServiceCollection services, IConfiguration configuration)
    {
        var appAuthOptions = configuration.GetSection("AuthTokenSettings")
            .Get<AppAuthOptions>();
        var sharedKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appAuthOptions.SigningKey));
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            // options.Authority = appAuthOptions.Authority;
            //options.Audience = appAuthOptions.Audience; // Configuration["Auth0:Audience"];
            //if (hostingEnvironment.EnvironmentName.Equals("development", StringComparison.InvariantCultureIgnoreCase))
            //    options.RequireHttpsMetadata = false;

            options.RequireHttpsMetadata = appAuthOptions.RequireHttpsMetadata;
            options.SaveToken = appAuthOptions.SaveToken;
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                // Clock skew compensates for server time drift.
                // We recommend 5 minutes or less:
                ClockSkew = TimeSpan.FromMinutes(appAuthOptions.ClockSkewInMinutes),
                // Specify the key used to sign the token:
                IssuerSigningKey = sharedKey,
                RequireSignedTokens = true,
                ValidateIssuerSigningKey = true,
                // Ensure the token hasn't expired:
                RequireExpirationTime = true,
                ValidateLifetime = true,
                // Ensure the token audience matches our audience value (default true):
                //ValidateAudience = true,
                // Configuration["Auth0:ValidAudience"]??"*",
                // Ensure the token was issued by a trusted authorization server (default true):
                ValidateAudience = appAuthOptions.ValidateAudience,
                ValidateIssuer = appAuthOptions.ValidateIssuer,
                // Ensure the token was issued by a trusted authorization server (default true):
                ValidIssuer = appAuthOptions.Authority
                //       ValidIssuer = "https://{yourOktaDomain}/oauth2/default"
            };

            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                    {
                        context.Response.Headers.Add("Token-Expired", "true");
                    }
                    return Task.CompletedTask;
                }
            };
        });
        return services;
    }
}
