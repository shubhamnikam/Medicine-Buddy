namespace MedicineBuddy.Main.API.Models;

public class CommonOutputType<T>
{
    public required ContextTitle ContextTitle { get; set; }
    public required ContextSubTitle ContextSubTitle { get; set; }
    public required ContextStatus ContextStatus { get; set; }
    public required string Message { get; set; }
    public required T Model { get; set; }
}

public enum ContextTitle
{
    AUTH = 1,
    USER,
    HOME
}
public enum ContextSubTitle
{
    LOGIN = 1,
    REGISTER,
    REFRESH_TOKEN,
    LOGOUT,
    PROFILE,
    HISTORY,
    DISEASE,
    QUESTION,
    MEDICINE
}
public enum ContextStatus
{
    INIT = 1,
    PENDING,
    PROGRESS,
    SUCCESS,
    FAIL,
    HOLD,
    CANCELLED
}
