using MedicineBuddy.Main.API.Controller;
using MedicineBuddy.Main.API.Entities;
using MedicineBuddy.Main.API.Models;
using MedicineBuddy.Main.API.Repositories;
using MedicineBuddy.Main.API.Utilities;

namespace MedicineBuddy.Main.API.Services;

public interface IHomeService
{
    Task<List<DiseaseSymptomMappingEntity>?> GetDiseaseSymptomMappingAsync();
    Task<List<QuestionMasterEntity>?> GetQuestionsAsync();
    Task<List<DiseaseMedicineMappingEntity>?> GetDiseaseMedicineMappingByDiseaseIdAsync(int diseaseId);
    Task<bool?> CreateUserDiseaseEntryAsync(CreateUserDiseaseEntryInputModel inputModel);
    Task<bool?> CreateUserQuestionEntryAsync(List<CreateUserQuestionEntryInputModel> inputModels);
    Task<bool?> CreateUserMedicineEntryAsync(List<CreateUserMedicineEntryInputModel> inputModels);
}

public class HomeService : IHomeService
{
    private readonly ILogger<HomeService> _logger;
    private readonly IHomeRepository _homeRepository;

    public HomeService(ILogger<HomeService> logger, IHomeRepository homeRepository)
    {
        _logger = logger;
        _homeRepository = homeRepository;
    }

    public async Task<List<DiseaseSymptomMappingEntity>?> GetDiseaseSymptomMappingAsync()
    {
        return await _homeRepository.GetDiseaseSymptomMappingAsync();
    }

    public async Task<List<QuestionMasterEntity>?> GetQuestionsAsync()
    {
        return await _homeRepository.GetQuestionsAsync();
    }

    public async Task<List<DiseaseMedicineMappingEntity>?> GetDiseaseMedicineMappingByDiseaseIdAsync(int diseaseId)
    {
        return await _homeRepository.GetDiseaseMedicineMappingByDiseaseIdAsync(diseaseId);
    }

    public async Task<bool?> CreateUserDiseaseEntryAsync(CreateUserDiseaseEntryInputModel inputModel)
    {
        return await _homeRepository.CreateUserDiseaseEntryAsync(inputModel);
    }

    public async Task<bool?> CreateUserQuestionEntryAsync(List<CreateUserQuestionEntryInputModel> inputModels)
    {
        return await _homeRepository.CreateUserQuestionEntryAsync(inputModels);
    }

    public async Task<bool?> CreateUserMedicineEntryAsync(List<CreateUserMedicineEntryInputModel> inputModels)
    {
        return await _homeRepository.CreateUserMedicineEntryAsync(inputModels);
    }

}