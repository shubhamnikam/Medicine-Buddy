namespace MedicineBuddy.Main.API.Models;

public class AuthTokenOutputModel
{
    public required int UserId { get; init; }
    public required string UserName { get; init; }
    public required string Token { get; init; }
    public required string RefreshToken { get; init; }
}