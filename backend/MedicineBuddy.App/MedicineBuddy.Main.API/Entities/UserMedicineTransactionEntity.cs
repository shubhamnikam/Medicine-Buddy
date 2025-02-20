using Microsoft.AspNetCore.Http.HttpResults;
using System.Transactions;

namespace MedicineBuddy.Main.API.Entities;

public class UserMedicineTransactionEntity : BaseEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int MedicineId { get; set; }
    public string TransactionId { get; set; }
}
