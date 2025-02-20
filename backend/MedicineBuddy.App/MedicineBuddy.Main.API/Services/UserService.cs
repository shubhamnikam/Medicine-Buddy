using MedicineBuddy.Main.API.Controller;
using MedicineBuddy.Main.API.Entities;
using MedicineBuddy.Main.API.Models;
using MedicineBuddy.Main.API.Repositories;
using MedicineBuddy.Main.API.Utilities;

namespace MedicineBuddy.Main.API.Services;

public interface IUserService
{
    Task<string?> RegisterAsync(UserRegisterInputModel inputModel);
    Task<UserProfileEntity?> GetUserProfileAsync(int userId);
    Task<UserDiagnosisHistoryEntity?> GetUserDiagnosisHistoryByUserIdAsync(int userId);
}

public class UserService : IUserService
{
    private readonly ILogger<UserService> _logger;
    private readonly IUserRepository _userRepository;

    public UserService(ILogger<UserService> logger, IUserRepository userRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
    }

    public async Task<string?> RegisterAsync(UserRegisterInputModel inputModel)
    {
        return await _userRepository.RegisterAsync(inputModel);
    }

    public async Task<UserProfileEntity?> GetUserProfileAsync(int userId)
    {
        return await _userRepository.GetUserProfileAsync(userId);
    }

    public async Task<UserDiagnosisHistoryEntity?> GetUserDiagnosisHistoryByUserIdAsync(int userId)
    {
        return await _userRepository.GetUserDiagnosisHistoryByUserIdAsync(userId);
    }

}
