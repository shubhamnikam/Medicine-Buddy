using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using MedicineBuddy.Main.API.Controller;
using MedicineBuddy.Main.API.Entities;
using MedicineBuddy.Main.API.Models;
using MedicineBuddy.Main.API.Options;
using MedicineBuddy.Main.API.Repositories;
using MedicineBuddy.Main.API.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace MedicineBuddy.Main.API.Services;

public interface IAuthService
{
    Task<UserMasterEntity?> GetUserByUserNameAsync(string userName);
    string CreateToken(UserMasterEntity userEntity);
    string CreateRefreshToken();
    Task<bool> SaveRefreshTokenAsync(string userName, string refreshToken);
    bool IsRefreshTokenValid(string inputRefreshToken, string dbRefreshToken);
    ClaimsPrincipal GetClaimsFromExpiredToken(string token);
}

public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    private readonly IAuthRepository _authRepository;
    private readonly AppAuthOptions _appAuthOptions;

    public AuthService(ILogger<AuthService> logger, IAuthRepository authRepository, IOptionsSnapshot<AppAuthOptions> appAuthOptions)
    {
        _logger = logger;
        _authRepository = authRepository;
        _appAuthOptions = appAuthOptions.Value;
    }

    public async Task<UserMasterEntity?> GetUserByUserNameAsync(string userName)
    {
        return await _authRepository.GetUserByUserNameAsync(userName);
    }

    public string CreateToken(UserMasterEntity userEntity)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_appAuthOptions.SigningKey);
        string validAudience = "*";
        if (_appAuthOptions.ValidAudience is not null & _appAuthOptions.ValidateAudience)
        {
            validAudience = string.Join(",", _appAuthOptions.ValidAudience!);
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _appAuthOptions.Authority,
            Audience = validAudience, //"*",
            Subject = new ClaimsIdentity([
                    new Claim (ClaimTypes.Sid, userEntity.Id.ToString()),
                    new Claim (ClaimTypes.Name, userEntity.UserName),
                    new Claim (ClaimTypes.Role, AppConstants.ROLE_ADMIN),
                ]),
            Expires = DateTime.UtcNow.AddMinutes(_appAuthOptions.TokenLifetimeMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)

        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        return tokenString;
    }

    public string CreateRefreshToken()
    {
        var guid = Guid.NewGuid().ToString();
        using var sha256 = SHA256.Create();
        var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(guid));
        return Convert.ToBase64String(hashBytes);
    }

    public async Task<bool> SaveRefreshTokenAsync(string userName, string refreshToken)
    {
        return await _authRepository.SaveRefreshTokenAsync(userName, refreshToken);
    }

    public bool IsRefreshTokenValid(string inputRefreshToken, string dbRefreshToken)
    {
        return inputRefreshToken == dbRefreshToken;
    }

    public ClaimsPrincipal GetClaimsFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appAuthOptions.SigningKey)),
            ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        var jwtSecurityToken = securityToken as JwtSecurityToken;
        if (jwtSecurityToken is null ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }
}
