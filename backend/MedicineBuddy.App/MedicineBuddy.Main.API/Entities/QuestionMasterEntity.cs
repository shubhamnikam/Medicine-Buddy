namespace MedicineBuddy.Main.API.Entities;

public class QuestionMasterEntity : BaseEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
}
