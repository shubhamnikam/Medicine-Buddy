﻿namespace MedicineBuddy.Main.API.Entities;

public class CreateUserQuestionEntryInputModel
{
    public int UserId { get; set; }
    public int QuestionId { get; set; }
    public string? Answer { get; set; }
    public required string TransactionId { get; set; }
}
