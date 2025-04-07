namespace MedicineBuddy.Main.API.Entities;

public class CreateUserDiseaseEntryInputModel
{
    public required int UserId { get; set; }
    public required int DiseaseId { get; set; }
    public required string TransactionId { get; set; }
}
