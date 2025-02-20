using System.Security.Cryptography;
using System.Transactions;
using MedicineBuddy.Main.API.Entities;
using MedicineBuddy.Main.API.Models;
using MedicineBuddy.Main.API.Services;
using MedicineBuddy.Main.API.Utilities;

namespace MedicineBuddy.Main.API.Repositories;

public interface IUserRepository
{
    Task<string?> RegisterAsync(UserRegisterInputModel inputModel);
    Task<UserProfileEntity?> GetUserProfileAsync(int userId);
    Task<UserDiagnosisHistoryEntity?> GetUserDiagnosisHistoryByUserIdAsync(int userId);
}

public class UserRepository : IUserRepository
{
    private readonly ILogger<UserRepository> _logger;
    private readonly IDbConnectionRepository _connectionRepository;

    public UserRepository(ILogger<UserRepository> logger, IDbConnectionRepository connectionRepository)
    {
        _logger = logger;
        _connectionRepository = connectionRepository;
    }

    public async Task<string?> RegisterAsync(UserRegisterInputModel inputModel)
    {
        var userEntity = new UserMasterEntity()
        {
            FirstName = inputModel.FirstName,
            LastName = inputModel.LastName,
            UserName = $"{inputModel.FirstName.ToLower()}{inputModel.LastName.ToLower()}_{Helper.GenerateRandomAlphanumeric(3)}",
            PasswordEncrypted = inputModel.PasswordEncrypted,
            Age = inputModel.Age,
            Height = inputModel.Height,
            Weight = inputModel.Weight,
            IsActive = true,
            CreatedBy = -1,
            ModifiedBy = -1,
        };

        // SQL Insert query
        string query = @"INSERT INTO UserMaster (FirstName, LastName, UserName, PasswordEncrypted, Age, Height, Weight, IsActive, CreatedBy, ModifiedBy)
    VALUES (@FirstName, @LastName, @UserName, @PasswordEncrypted, @Age, @Height, @Weight, @IsActive, @CreatedBy, @ModifiedBy);";

        // Create the parameters dictionary
        var parameters = new Dictionary<string, object>
        {
            { "@FirstName", userEntity.FirstName },
            { "@LastName", userEntity.LastName },
            { "@UserName", userEntity.UserName },
            { "@PasswordEncrypted", userEntity.PasswordEncrypted },
            { "@Age", userEntity.Age },
            { "@Height", userEntity.Height },
            { "@Weight", userEntity.Weight },
            { "@IsActive", userEntity.IsActive },
            { "@CreatedBy", userEntity.CreatedBy },
            { "@ModifiedBy", userEntity.ModifiedBy }
        };

        var affectedRows = await _connectionRepository.ExecuteWriteAsync(query, parameters);
        return affectedRows > 0 ? userEntity.UserName : null;
    }

    public async Task<UserProfileEntity?> GetUserProfileAsync(int userId)
    {
        string query = @"
            SELECT 
            Id, FirstName, LastName, UserName, PasswordEncrypted, Age, Height, Weight, IsActive, CreatedBy, ModifiedBy, CreatedOn, ModifiedOn
            FROM UserMaster
            WHERE Id=@UserId";

        // Create the parameters dictionary
        var parameters = new Dictionary<string, object>
        {
            { "@UserId", userId },
        };

        var result = await _connectionRepository.ExecuteReadAsync<UserProfileEntity>(query, parameters);
        return result?.Count > 0 ? result[0] : null;
    }

    public async Task<UserDiagnosisHistoryEntity?> GetUserDiagnosisHistoryByUserIdAsync(int userId)
    {

        // get user
        var userDict = await GetUserDiagnosisHistory_UserAsync(userId);
        // get disease data
        var diseasesDict = await GetUserDiagnosisHistory_DiseaseAsync(userId);
        if (diseasesDict.Count > 0)
        {
            // get symptoms data
            var symtomsDict = await GetUserDiagnosisHistory_SymptomsAsync(userId, diseasesDict);
            // get questions data
            var questionsDict = await GetUserDiagnosisHistory_QuestionAsync(userId, diseasesDict);
            // get medicine data
            var medicinesDict = await GetUserDiagnosisHistory_MedicineAsync(userId, diseasesDict);


            var diagnosticHistory = new UserDiagnosisHistoryEntity()
            {
                DictUserEntity = userDict,
                DictDiseaseEntity = diseasesDict,
                DictSymptomEntity = symtomsDict,
                DictQuestionEntity = questionsDict,
                DictMedicineEntity = medicinesDict,
            };
            return diagnosticHistory;
        }

        return null;
    }


    private async Task<Dictionary<int, UserDiagnosisHistory_UserEntity>?> GetUserDiagnosisHistory_UserAsync(int userId)
    {
        string query = @"
           select
                u.Id As UserId,
                u.FirstName,
                u.LastName,
                u.UserName,
                u.Age,
                u.Height,
                u.Weight,
                u.CreatedOn,
                u.ModifiedOn
            FROM UserMaster u
            where u.Id = @UserId";

        // Create the parameters dictionary
        var parameters = new Dictionary<string, object>
        {
            { "@UserId", userId },
        };

        var result = await _connectionRepository.ExecuteReadAsync<UserDiagnosisHistory_UserEntity>(query, parameters);


        if (result.Count <= 0)
        {
            return null;
        }

        var dict = new Dictionary<int, UserDiagnosisHistory_UserEntity>()
        {
            [result[0].UserId] = result[0]
        };
        return dict;
    }


    private async Task<Dictionary<string, UserDiagnosisHistory_DiseaseEntity>?> GetUserDiagnosisHistory_DiseaseAsync(int userId)
    {
        string query = @"
          SELECT
                u.Id As UserId,

                udt.TransactionId As TransactionId,

                udt.Id As UserDiseaseTransactionId,
                udt.CreatedOn As UserDiseaseCreatedOn,

                dm.Id As DiseaseId,
                dm.Title As DiseaseTitle,
                dm.Description As DiseaseDescription
            FROM UserMaster u
            inner join UserDiseaseTransaction udt on udt.UserId = u.Id
            inner join DiseaseMaster dm on dm.Id = udt.DiseaseId
            where u.Id = @UserId;
";

        // Create the parameters dictionary
        var parameters = new Dictionary<string, object>
        {
            { "@UserId", userId },
        };

        var result = await _connectionRepository.ExecuteReadAsync<UserDiagnosisHistory_DiseaseEntity>(query, parameters);


        if (result.Count <= 0)
        {
            return null;
        }

        var dict = new Dictionary<string, UserDiagnosisHistory_DiseaseEntity>();
        foreach (var item in result)
        {
            dict.Add(item.TransactionId, item);
        }
        return dict;
    }


    private async Task<Dictionary<string, List<UserDiagnosisHistory_SymptomEntity>>?> GetUserDiagnosisHistory_SymptomsAsync(int userId,
        Dictionary<string, UserDiagnosisHistory_DiseaseEntity> dictDisease)
    {

        var dict = new Dictionary<string, List<UserDiagnosisHistory_SymptomEntity>>();
        foreach (var transactionId in dictDisease.Keys)
        {
            string query = @"
            SELECT
                u.Id As UserId,

                udt.TransactionId As TransactionId,

                udt.Id As DiseaseSymptomMappingId,

                sm.Id As SymptomId,
                sm.Title As SymptomTitle,
                sm.Description As SymptomDescription
            FROM UserMaster u
            inner join UserDiseaseTransaction udt on udt.UserId = u.Id
            inner join DiseaseMaster dm on dm.Id = udt.DiseaseId
            inner join DiseaseSymptomMapping dsm on dsm.DiseaseId = dm.Id
            inner join SymptomMaster sm on sm.Id = dsm.SymptomId
            where u.Id = @UserId and udt.TransactionId = @TransactionId;
";

            // Create the parameters dictionary
            var parameters = new Dictionary<string, object>
        {
            { "@UserId", userId },
            { "@TransactionId", transactionId },
        };

            var result = await _connectionRepository.ExecuteReadAsync<UserDiagnosisHistory_SymptomEntity>(query, parameters);


            if (result.Count <= 0)
            {
                dict.Add(result[0].TransactionId, []);
            }

            dict.Add(result[0].TransactionId, result);
        }
        return dict;
    }


    private async Task<Dictionary<string, List<UserDiagnosisHistory_QuestionEntity>>?> GetUserDiagnosisHistory_QuestionAsync(int userId,
        Dictionary<string, UserDiagnosisHistory_DiseaseEntity> dictDisease)
    {
        var dict = new Dictionary<string, List<UserDiagnosisHistory_QuestionEntity>>();
        foreach (var transactionId in dictDisease.Keys)
        {
            string query = @"
            select
                u.Id As UserId,

                uqt.TransactionId As TransactionId,

                uqt.Id As UserQuestionTransactionId,
                uqt.CreatedOn As UserQuestionTransactionCreatedOn,
                uqt.Answer As UserQuestionTransactionAnswer,

                qm.Id As QuestionId,
                qm.Title As QuestionTitle,
                qm.Description As QuestionDescription
            FROM UserMaster u
            inner join UserQuestionTransaction uqt on uqt.UserId = u.Id
            inner join QuestionMaster qm on qm.Id = uqt.QuestionId
            where u.Id = @UserId and uqt.TransactionId = @TransactionId;
";

            // Create the parameters dictionary
            var parameters = new Dictionary<string, object>
        {
            { "@UserId", userId },
            { "@TransactionId", transactionId },
        };

            var result = await _connectionRepository.ExecuteReadAsync<UserDiagnosisHistory_QuestionEntity>(query, parameters);


            if (result.Count <= 0)
            {
                dict.Add(result[0].TransactionId, []);
            }

            dict.Add(result[0].TransactionId, result);
        }
        return dict;
    }


    private async Task<Dictionary<string, List<UserDiagnosisHistory_MedicineEntity>>?> GetUserDiagnosisHistory_MedicineAsync(int userId,
        Dictionary<string, UserDiagnosisHistory_DiseaseEntity> dictDisease)
    {
        var dict = new Dictionary<string, List<UserDiagnosisHistory_MedicineEntity>>();
        foreach (var transactionId in dictDisease.Keys)
        {
            string query = @"
            select
                u.Id As UserId,

                umt.TransactionId As TransactionId,

                umt.Id As UserMedicineTransactionId,
                umt.CreatedOn As UserMedicineTransactionCreatedOn,

                mm.Id As MedicineId,
                mm.Title As MedicineTitle,
                mm.Description As MedicineDescription
            FROM UserMaster u
            inner join UserMedicineTransaction umt on umt.UserId = u.Id
            inner join MedicineMaster mm on mm.Id = umt.MedicineId
            where u.Id = @UserId and umt.TransactionId =  @TransactionId;
";

            // Create the parameters dictionary
            var parameters = new Dictionary<string, object>
        {
            { "@UserId", userId },
            { "@TransactionId", transactionId },
        };

            var result = await _connectionRepository.ExecuteReadAsync<UserDiagnosisHistory_MedicineEntity>(query, parameters);


            if (result.Count <= 0)
            {
                dict.Add(result[0].TransactionId, []);
            }

            dict.Add(result[0].TransactionId, result);
        }
        return dict;
    }

}