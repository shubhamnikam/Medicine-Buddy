using Microsoft.AspNetCore.Http.HttpResults;
using System.Transactions;

namespace MedicineBuddy.Main.API.Entities;

public class UserQuestionTransactionEntity : BaseEntity
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int QuestionId { get; set; }
    public string Answer { get; set; }
    public string TransactionId { get; set; }
}
