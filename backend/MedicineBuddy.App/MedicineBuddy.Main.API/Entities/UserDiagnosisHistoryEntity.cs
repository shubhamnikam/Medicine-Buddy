namespace MedicineBuddy.Main.API.Entities;


public class UserDiagnosisHistoryEntity
{
    // string - TransactionId
    public Dictionary<int, UserDiagnosisHistory_UserEntity> DictUserEntity { get; set; }
    // string - TransactionId
    public Dictionary<string, UserDiagnosisHistory_DiseaseEntity> DictDiseaseEntity { get; set; }
    // string - TransactionId
    public Dictionary<string, List<UserDiagnosisHistory_SymptomEntity>> DictSymptomEntity { get; set; }
    // string - TransactionId
    public Dictionary<string, List<UserDiagnosisHistory_QuestionEntity>> DictQuestionEntity { get; set; }
    // string - TransactionId
    public Dictionary<string, List<UserDiagnosisHistory_MedicineEntity>> DictMedicineEntity { get; set; }
}
public class UserDiagnosisHistory_UserEntity
{
    public int UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public int Age { get; set; }
    public decimal Height { get; set; }
    public decimal Weight { get; set; }
    public DateTime CreatedOn { get; set; }
    public DateTime ModifiedOn { get; set; }
}
public class UserDiagnosisHistory_DiseaseEntity
{
    public int UserId { get; set; }
    public string TransactionId { get; set; }
    public int UserDiseaseTransactionId { get; set; }
    public DateTime UserDiseaseCreatedOn { get; set; }
    public int DiseaseId { get; set; }
    public string DiseaseTitle { get; set; }
    public string DiseaseDescription { get; set; }
}

public class UserDiagnosisHistory_SymptomEntity
{
    public int UserId { get; set; }
    public string TransactionId { get; set; }
    public int DiseaseSymptomMappingId { get; set; }
    public int SymptomId { get; set; }
    public string SymptomTitle { get; set; }
    public string SymptomDescription { get; set; }
}

public class UserDiagnosisHistory_QuestionEntity
{
    public int UserId { get; set; }
    public string TransactionId { get; set; }
    public int UserQuestionTransactionId { get; set; }
    public DateTime UserQuestionTransactionCreatedOn { get; set; }
    public string UserQuestionTransactionAnswer { get; set; }
    public int QuestionId { get; set; }
    public string QuestionTitle { get; set; }
    public string QuestionDescription { get; set; }
}

public class UserDiagnosisHistory_MedicineEntity
{
    public int UserId { get; set; }
    public string TransactionId { get; set; }
    public int UserMedicineTransactionId { get; set; }
    public DateTime UserMedicineTransactionCreatedOn { get; set; }
    public int MedicineId { get; set; }
    public string MedicineTitle { get; set; }
    public string MedicineDescription { get; set; }
}
