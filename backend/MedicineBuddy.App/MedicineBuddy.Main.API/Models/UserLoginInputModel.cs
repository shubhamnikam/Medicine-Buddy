namespace MedicineBuddy.Main.API.Models;

public class UserLoginInputModel
{
    public required string UserName { get; init; }
    public required string Password { get; init; }
}
