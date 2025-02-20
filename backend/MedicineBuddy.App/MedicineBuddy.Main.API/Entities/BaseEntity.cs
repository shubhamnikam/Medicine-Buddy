namespace MedicineBuddy.Main.API.Entities;

public class BaseEntity
{
    public bool IsActive { get; set; }
    public int CreatedBy { get; set; }
    public int ModifiedBy { get; set; }
    public DateTime CreatedOn { get; set; }
    public DateTime ModifiedOn { get; set; }
}
