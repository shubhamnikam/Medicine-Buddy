using System.Xml;
using MedicineBuddy.Main.API.Entities;
using MedicineBuddy.Main.API.Models;
using MedicineBuddy.Main.API.Services;
using MedicineBuddy.Main.API.Utilities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Mysqlx.Crud;
using static Mysqlx.Expect.Open.Types.Condition.Types;

namespace MedicineBuddy.Main.API.Repositories;

public interface IAuthRepository
{
    Task<UserMasterEntity?> GetUserByUserNameAsync(string userName);
    Task<bool> SaveRefreshTokenAsync(string userName, string refreshToken);
    Task<bool> IsRefreshTokenValidAsync(string userName);
}

public class AuthRepository : IAuthRepository
{
    private readonly ILogger<AuthRepository> _logger;
    private readonly IDbConnectionRepository _connectionRepository;

    public AuthRepository(ILogger<AuthRepository> logger, IDbConnectionRepository connectionRepository)
    {
        _logger = logger;
        _connectionRepository = connectionRepository;
    }

    public async Task<UserMasterEntity?> GetUserByUserNameAsync(string userName)
    {
        // SQL Insert query
        string query = @"
        SELECT Id, FirstName, LastName, UserName, PasswordEncrypted, RefreshToken, Age, Height, Weight, IsActive, CreatedBy, ModifiedBy, CreatedOn, ModifiedOn
        FROM UserMaster
        WHERE UserName=@UserName";

        // Create the parameters dictionary
        var parameters = new Dictionary<string, object>
        {
            { "@UserName", userName },
        };

        var result = await _connectionRepository.ExecuteReadAsync<UserMasterEntity>(query, parameters);
        return result?.Count > 0 ? result[0] : null;
    }

    public async Task<bool> IsRefreshTokenValidAsync(string userName)
    {
        // SQL Insert query
        string query = @"
        SELECT EXISTS(
            SELECT 1 FROM UserMaster WHERE UserName = @UserName AND RefreshToken IS NOT NULL
        );";

        // Create the parameters dictionary
        var parameters = new Dictionary<string, object>
        {
            { "@UserName", userName },
        };

        var result = await _connectionRepository.ExecuteReadAsync<bool>(query, parameters);
        return result?.Count > 0 ? result[0] : false;
    }

    public async Task<bool> SaveRefreshTokenAsync(string userName, string refreshToken)
    {
        // SQL Insert query
        string query = @"
        UPDATE UserMaster
        SET RefreshToken=@RefreshToken
        WHERE UserName=@UserName;";

        // Create the parameters dictionary
        var parameters = new Dictionary<string, object>
        {
            { "@UserName", userName },
            { "@RefreshToken", refreshToken },
        };

        var result = await _connectionRepository.ExecuteWriteAsync(query, parameters);
        return result > 0;
    }
}
