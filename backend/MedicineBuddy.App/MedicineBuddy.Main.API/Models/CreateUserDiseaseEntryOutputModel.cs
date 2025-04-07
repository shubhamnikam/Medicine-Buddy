namespace MedicineBuddy.Main.API.Entities;

public class CreateUserDiseaseEntryOutputModel
{
    public required int UserId { get; set; }
    public required int DiseaseId { get; set; }
    public required string TransactionId { get; set; }
}
