using System.Transactions;

namespace MedicineBuddy.Main.API.Entities;

public class DiseaseSymptomMappingEntity
{
    public int DiseaseSymptomMappingId { get; set; }
    public int DiseaseId { get; set; }
    public string DiseaseTitle { get; set; }
    public string DiseaseDescription { get; set; }
    public bool DiseaseIsActive { get; set; }
    public int SymptomId { get; set; }
    public string SymptomTitle { get; set; }
    public string SymptomDescription { get; set; }
    public bool SymptomIsActive { get; set; }
}
