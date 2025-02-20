namespace MedicineBuddy.Main.API.Entities;

public class CreateUserMedicineEntryInputModel
{
    public int UserId { get; set; }
    public int MedicineId { get; set; }
    public string TransactionId { get; set; }
}
