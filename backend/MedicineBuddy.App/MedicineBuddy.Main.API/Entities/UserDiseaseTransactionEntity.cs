using Microsoft.AspNetCore.Http.HttpResults;
using System.Transactions;

namespace MedicineBuddy.Main.API.Entities;

public class UserDiseaseTransactionEntity : BaseEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int DiseaseId { get; set; }
    public string TransactionId { get; set; }
}
