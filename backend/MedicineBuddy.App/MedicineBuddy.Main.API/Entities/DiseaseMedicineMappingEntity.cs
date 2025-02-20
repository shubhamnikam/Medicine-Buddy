namespace MedicineBuddy.Main.API.Entities;

public class DiseaseMedicineMappingEntity
{
    public int DiseaseMedicineMappingId { get; set; }
    public int DiseaseId { get; set; }
    public string DiseaseTitle { get; set; }
    public string DiseaseDescription { get; set; }
    public bool DiseaseIsActive { get; set; }
    public int MedicineId { get; set; }
    public string MedicineTitle { get; set; }
    public string MedicineDescription { get; set; }
    public bool MedicineIsActive { get; set; }
}
