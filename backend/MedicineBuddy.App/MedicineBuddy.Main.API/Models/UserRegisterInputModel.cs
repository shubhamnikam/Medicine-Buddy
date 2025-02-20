namespace MedicineBuddy.Main.API.Models;

public class UserRegisterInputModel
{
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string PasswordEncrypted { get; init; }
    public required int Age { get; init; }
    public required decimal Height { get; init; }
    public required decimal Weight { get; init; }
}
