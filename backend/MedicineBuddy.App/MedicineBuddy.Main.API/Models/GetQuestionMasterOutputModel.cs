namespace MedicineBuddy.Main.API.Models;

public class GetQuestionMasterOutputModel
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string? TransactionId { get; set; }
    public bool IsActive { get; set; }
}
