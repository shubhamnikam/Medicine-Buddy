namespace MedicineBuddy.Main.API.Models;

public class AuthRefreshTokenInputModel
{
    public required string Token { get; init; }
    public required string RefreshToken { get; init; }
}