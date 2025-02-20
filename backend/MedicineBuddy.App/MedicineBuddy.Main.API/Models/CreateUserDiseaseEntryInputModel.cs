namespace MedicineBuddy.Main.API.Entities;

public class CreateUserDiseaseEntryInputModel
{
    public int UserId { get; set; }
    public int DiseaseId { get; set; }
    public string TransactionId { get; set; }
}
