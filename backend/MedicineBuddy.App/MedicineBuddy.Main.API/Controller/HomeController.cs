using System.Net;
using MedicineBuddy.Main.API.Entities;
using MedicineBuddy.Main.API.Models;
using MedicineBuddy.Main.API.Services;
using MedicineBuddy.Main.API.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace MedicineBuddy.Main.API.Controller;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    private readonly ILogger<HomeController> _logger;
    private readonly IHomeService _homeService;

    public HomeController(ILogger<HomeController> logger, IHomeService homeService)
    {
        _logger = logger;
        _homeService = homeService;
    }

    [HttpGet("GetDiseaseSymptomMapping")]
    public async Task<ActionResult> GetDiseaseSymptomMappingAsync()
    {
        try
        {
            var result = await _homeService.GetDiseaseSymptomMappingAsync();

            if (result is null)
            {
                throw new Exception("Questions not found");
            }

            // generate Transaction ID
            string tranasctionId = Guid.CreateVersion7().ToString();
            var outputModels = result.Select(x => new GetDiseaseSymptomMappingOutputModel
            {
                DiseaseSymptomMappingId = x.DiseaseSymptomMappingId,
                DiseaseId = x.DiseaseId,
                DiseaseTitle = x.DiseaseTitle,
                DiseaseDescription = x.DiseaseDescription,
                DiseaseIsActive = x.DiseaseIsActive,
                SymptomId = x.SymptomId,
                SymptomTitle = x.SymptomTitle,
                SymptomDescription = x.SymptomDescription,
                SymptomIsActive = x.SymptomIsActive,
                TransactionId = tranasctionId
            }).ToList();
            var commonOutput = new CommonOutputType<List<GetDiseaseSymptomMappingOutputModel>>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.DISEASE,
                ContextStatus = ContextStatus.SUCCESS,
                Message = $"DiseaseSymptomMapping found {outputModels.Count}",
                Model = outputModels!
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.DISEASE,
                ContextStatus = ContextStatus.FAIL,
                Message = "Error to get DiseaseSymptomMapping",
                Model = new ProblemDetails()
                {
                    Title = ex.Message,
                    Detail = ex.StackTrace,
                    Status = (int)HttpStatusCode.BadRequest,
                }
            };
            return BadRequest(commonOutput);
        }
    }

    [HttpPost("GetQuestions")]
    public async Task<ActionResult> GetQuestionsAsync([FromBody] GetQuestionsInputModel inputModel)
    {
        try
        {
            var result = await _homeService.GetQuestionsAsync();

            if (result is null)
            {
                throw new Exception("Questions not found");
            }

            var outputModels = result.Select(x => new GetQuestionMasterOutputModel
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                IsActive = x.IsActive,
                TransactionId = inputModel.TransactionId
            }).ToList();
            var commonOutput = new CommonOutputType<List<GetQuestionMasterOutputModel>>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.QUESTION,
                ContextStatus = ContextStatus.SUCCESS,
                Message = $"Questions found {outputModels.Count}",
                Model = outputModels!
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.QUESTION,
                ContextStatus = ContextStatus.FAIL,
                Message = "Error to get questions",
                Model = new ProblemDetails()
                {
                    Title = ex.Message,
                    Detail = ex.StackTrace,
                    Status = (int)HttpStatusCode.BadRequest,
                }
            };
            return BadRequest(commonOutput);
        }
    }

    [HttpPost("GetDiseaseMedicineMapping")]
    public async Task<ActionResult> GetDiseaseMedicineMappingAsync([FromBody] GetDiseaseMedicineMappingInputModel inputModel)
    {
        try
        {
            var result = await _homeService.GetDiseaseMedicineMappingByDiseaseIdAsync(inputModel.DiseaseId);

            if (result is null)
            {
                throw new Exception("DiseaseMedicineMapping not found");
            }


            var outputModels = result.Select(x => new GetDiseaseMedicineMappingOutputModel
            {
                DiseaseMedicineMappingId = x.DiseaseMedicineMappingId,
                DiseaseId = x.DiseaseId,
                DiseaseTitle = x.DiseaseTitle,
                DiseaseDescription = x.DiseaseDescription,
                DiseaseIsActive = x.DiseaseIsActive,
                MedicineId = x.MedicineId,
                MedicineTitle = x.MedicineTitle,
                MedicineDescription = x.MedicineDescription,
                MedicineIsActive = x.MedicineIsActive,
                TransactionId = inputModel.TransactionId
            }).ToList();
            var commonOutput = new CommonOutputType<List<GetDiseaseMedicineMappingOutputModel>>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.MEDICINE,
                ContextStatus = ContextStatus.SUCCESS,
                Message = $"DiseaseMedicineMapping found {outputModels.Count}",
                Model = outputModels!
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.MEDICINE,
                ContextStatus = ContextStatus.FAIL,
                Message = "Error to get DiseaseMedicineMapping",
                Model = new ProblemDetails()
                {
                    Title = ex.Message,
                    Detail = ex.StackTrace,
                    Status = (int)HttpStatusCode.BadRequest,
                }
            };
            return BadRequest(commonOutput);
        }
    }



    [HttpPost("CreateUserDiseaseEntry")]
    public async Task<ActionResult> CreateUserDiseaseEntry([FromBody] CreateUserDiseaseEntryInputModel inputModel)
    {
        try
        {
            var result = await _homeService.CreateUserDiseaseEntryAsync(inputModel);

            if (result is null)
            {
                throw new Exception("CreateUserDiseaseEntry not found");
            }

            var commonOutput = new CommonOutputType<CreateUserDiseaseEntryOutputModel>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.DISEASE,
                ContextStatus = ContextStatus.SUCCESS,
                Message = $"CreateUserDiseaseEntry success",
                Model = new CreateUserDiseaseEntryOutputModel() {
                    UserId = inputModel.UserId,
                    DiseaseId = inputModel.DiseaseId,
                    TransactionId = inputModel.TransactionId,
                }
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.DISEASE,
                ContextStatus = ContextStatus.FAIL,
                Message = "Error to get CreateUserDiseaseEntry",
                Model = new ProblemDetails()
                {
                    Title = ex.Message,
                    Detail = ex.StackTrace,
                    Status = (int)HttpStatusCode.BadRequest,
                }
            };
            return BadRequest(commonOutput);
        }
    }


    [HttpPost("CreateUserQuestionEntry")]
    public async Task<ActionResult> CreateUserQuestionEntry([FromBody] List<CreateUserQuestionEntryInputModel> inputModel)
    {
        try
        {
            var result = await _homeService.CreateUserQuestionEntryAsync(inputModel);

            if (result is null)
            {
                throw new Exception("CreateUserQuestionEntry not found");
            }

            var commonOutput = new CommonOutputType<bool?>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.QUESTION,
                ContextStatus = ContextStatus.SUCCESS,
                Message = $"CreateUserQuestionEntry success",
                Model = result
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.QUESTION,
                ContextStatus = ContextStatus.FAIL,
                Message = "Error to get CreateUserQuestionEntry",
                Model = new ProblemDetails()
                {
                    Title = ex.Message,
                    Detail = ex.StackTrace,
                    Status = (int)HttpStatusCode.BadRequest,
                }
            };
            return BadRequest(commonOutput);
        }
    }


    [HttpPost("CreateUserMedicineEntry")]
    public async Task<ActionResult> CreateUserMedicineEntry([FromBody] List<CreateUserMedicineEntryInputModel> inputModel)
    {
        try
        {
            var result = await _homeService.CreateUserMedicineEntryAsync(inputModel);

            if (result is null)
            {
                throw new Exception("CreateUserMedicineEntry not found");
            }

            var commonOutput = new CommonOutputType<bool?>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.MEDICINE,
                ContextStatus = ContextStatus.SUCCESS,
                Message = $"CreateUserMedicineEntry success",
                Model = result
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.HOME,
                ContextSubTitle = ContextSubTitle.MEDICINE,
                ContextStatus = ContextStatus.FAIL,
                Message = "Error to get CreateUserMedicineEntry",
                Model = new ProblemDetails()
                {
                    Title = ex.Message,
                    Detail = ex.StackTrace,
                    Status = (int)HttpStatusCode.BadRequest,
                }
            };
            return BadRequest(commonOutput);
        }
    }


}
