using MedicineBuddy.Main.API.Entities;
using MedicineBuddy.Main.API.Utilities;

namespace MedicineBuddy.Main.API.Repositories;

public interface IHomeRepository
{
    // GET for diagnostic
    Task<List<DiseaseSymptomMappingEntity>?> GetDiseaseSymptomMappingAsync();
    Task<List<QuestionMasterEntity>?> GetQuestionsAsync();
    Task<List<DiseaseMedicineMappingEntity>?> GetDiseaseMedicineMappingByDiseaseIdAsync(int diseaseId);

    // SET after diagnostic
    Task<bool?> CreateUserDiseaseEntryAsync(CreateUserDiseaseEntryInputModel inputModel);
    Task<bool?> CreateUserQuestionEntryAsync(List<CreateUserQuestionEntryInputModel> inputModels);
    Task<bool?> CreateUserMedicineEntryAsync(List<CreateUserMedicineEntryInputModel> inputModels);

    // GET for history
}

public class HomeRepository : IHomeRepository
{
    private readonly ILogger<HomeRepository> _logger;
    private readonly IDbConnectionRepository _connectionRepository;

    public HomeRepository(ILogger<HomeRepository> logger, IDbConnectionRepository connectionRepository)
    {
        _logger = logger;
        _connectionRepository = connectionRepository;
    }

    public async Task<List<DiseaseSymptomMappingEntity>?> GetDiseaseSymptomMappingAsync()
    {
        string query = @"
            SELECT 
                dsm.Id AS DiseaseSymptomMappingId, 

                d.Id AS DiseaseId, 
                d.Title AS DiseaseTitle, 
                d.Description AS DiseaseDescription,
                d.IsActive AS DiseaseIsActive,

                s.Id AS SymptomId, 
                s.Title AS SymptomTitle, 
                s.Description AS SymptomDescription,
                s.IsActive AS SymptomIsActive

            FROM DiseaseSymptomMapping dsm
            JOIN DiseaseMaster d ON d.Id = dsm.DiseaseId
            JOIN SymptomMaster s ON dsm.SymptomId = s.Id

            WHERE d.IsActive = TRUE AND s.IsActive = TRUE AND dsm.IsActive = TRUE;          
";

        var parameters = new Dictionary<string, object>();

        var result = await _connectionRepository.ExecuteReadAsync<DiseaseSymptomMappingEntity>(query, parameters);

        return result?.Count > 0 ? result : null;
    }


    public async Task<List<QuestionMasterEntity>?> GetQuestionsAsync()
    {
        string query = @"
            SELECT
            Id, Title, Description, IsActive, CreatedBy, ModifiedBy, CreatedOn, ModifiedOn
            FROM QuestionMaster
            WHERE IsActive=TRUE;";

        var parameters = new Dictionary<string, object>();

        var result = await _connectionRepository.ExecuteReadAsync<QuestionMasterEntity>(query, parameters);

        return result?.Count > 0 ? result : null;
    }


    public async Task<List<DiseaseMedicineMappingEntity>?> GetDiseaseMedicineMappingByDiseaseIdAsync(int diseaseId)
    {
        string query = @"
            SELECT 
                dsm.Id AS DiseaseMedicineMappingId, 

                d.Id AS DiseaseId, 
                d.Title AS DiseaseTitle, 
                d.Description AS DiseaseDescription,
                d.IsActive AS DiseaseIsActive,

                m.Id AS MedicineId, 
                m.Title AS MedicineTitle, 
                m.Description AS MedicineDescription,
                m.IsActive AS MedicineIsActive

            FROM DiseaseMedicineMapping dsm
            JOIN DiseaseMaster d ON d.Id = dsm.DiseaseId
            JOIN MedicineMaster m ON dsm.MedicineId = m.Id

            WHERE d.Id=@DiseaseId AND d.IsActive = TRUE AND m.IsActive = TRUE AND dsm.IsActive = TRUE;          
";

        var parameters = new Dictionary<string, object>()
        {
            { "@DiseaseId", diseaseId },
        };

        var result = await _connectionRepository.ExecuteReadAsync<DiseaseMedicineMappingEntity>(query, parameters);

        return result?.Count > 0 ? result : null;
    }

    public async Task<bool?> CreateUserDiseaseEntryAsync(CreateUserDiseaseEntryInputModel inputModel)
    {
        var entity = new UserDiseaseTransactionEntity()
        {
            UserId = inputModel.UserId,
            DiseaseId = inputModel.DiseaseId,
            TransactionId = inputModel.TransactionId,
            IsActive = true,
            CreatedBy = inputModel.UserId,
            ModifiedBy = inputModel.UserId,
        };

        // SQL Insert query
        string query = @"INSERT INTO UserDiseaseTransaction (UserId, DiseaseId, TransactionId, IsActive, CreatedBy, ModifiedBy)
    VALUES (@UserId, @DiseaseId, @TransactionId, @IsActive, @CreatedBy, @ModifiedBy);";

        // Create the parameters dictionary
        var parameters = new Dictionary<string, object>
        {
            { "@UserId", entity.UserId },
            { "@DiseaseId", entity.DiseaseId },
            { "@TransactionId", entity.TransactionId },
            { "@IsActive", entity.IsActive },
            { "@CreatedBy", entity.CreatedBy },
            { "@ModifiedBy", entity.ModifiedBy }
        };

        var affectedRows = await _connectionRepository.ExecuteWriteAsync(query, parameters);
        return affectedRows > 0;
    }

    public async Task<bool?> CreateUserQuestionEntryAsync(List<CreateUserQuestionEntryInputModel> inputModels)
    {
        List<bool> isSuccessList = new();
        foreach (var inputModel in inputModels)
        {
            var entity = new UserQuestionTransactionEntity()
            {
                UserId = inputModel.UserId,
                QuestionId = inputModel.QuestionId,
                Answer = inputModel.Answer,
                TransactionId = inputModel.TransactionId,
                IsActive = true,
                CreatedBy = inputModel.UserId,
                ModifiedBy = inputModel.UserId,
            };

            // SQL Insert query
            string query = @"INSERT INTO UserQuestionTransaction (UserId, QuestionId, Answer, TransactionId, IsActive, CreatedBy, ModifiedBy)
    VALUES (@UserId, @QuestionId, @Answer, @TransactionId, @IsActive, @CreatedBy, @ModifiedBy);";

            // Create the parameters dictionary
            var parameters = new Dictionary<string, object>
        {
            { "@UserId", entity.UserId },
            { "@QuestionId", entity.QuestionId },
            { "@Answer", entity.Answer },
            { "@TransactionId", entity.TransactionId },
            { "@IsActive", entity.IsActive },
            { "@CreatedBy", entity.CreatedBy },
            { "@ModifiedBy", entity.ModifiedBy }
        };

            var affectedRows = await _connectionRepository.ExecuteWriteAsync(query, parameters);
            isSuccessList.Add(affectedRows > 0);
        }
        return isSuccessList.All(x => x);
    }


    public async Task<bool?> CreateUserMedicineEntryAsync(List<CreateUserMedicineEntryInputModel> inputModels)
    {
        List<bool> isSuccessList = new();
        foreach (var inputModel in inputModels)
        {
            var entity = new UserMedicineTransactionEntity()
            {
                UserId = inputModel.UserId,
                MedicineId = inputModel.MedicineId,
                TransactionId = inputModel.TransactionId,
                IsActive = true,
                CreatedBy = inputModel.UserId,
                ModifiedBy = inputModel.UserId,
            };

            // SQL Insert query
            string query = @"INSERT INTO UserMedicineTransaction (UserId, MedicineId, TransactionId, IsActive, CreatedBy, ModifiedBy)
    VALUES (@UserId, @MedicineId, @TransactionId, @IsActive, @CreatedBy, @ModifiedBy);";

            // Create the parameters dictionary
            var parameters = new Dictionary<string, object>
        {
            { "@UserId", entity.UserId },
            { "@MedicineId", entity.MedicineId },
            { "@TransactionId", entity.TransactionId },
            { "@IsActive", entity.IsActive },
            { "@CreatedBy", entity.CreatedBy },
            { "@ModifiedBy", entity.ModifiedBy }
        };

            var affectedRows = await _connectionRepository.ExecuteWriteAsync(query, parameters);
            isSuccessList.Add(affectedRows > 0);
        }
        return isSuccessList.All(x => x);
    }
}
