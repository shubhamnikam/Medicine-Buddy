﻿namespace MedicineBuddy.Main.API.Entities;

public class UserMasterEntity : BaseEntity
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string PasswordEncrypted { get; set; }
    public string RefreshToken { get; set; }
    public int Age { get; set; }
    public decimal Height { get; set; }
    public decimal Weight { get; set; }
}
