using System.Net;
using MedicineBuddy.Main.API.Entities;
using MedicineBuddy.Main.API.Models;
using MedicineBuddy.Main.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace MedicineBuddy.Main.API.Controller;

[AllowAnonymous]
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly ILogger<UserController> _logger;
    private readonly IUserService _userService;

    public UserController(ILogger<UserController> logger, IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }

    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<ActionResult> RegisterAsync([FromBody] UserRegisterInputModel inputModel)
    {
        try
        {
            if (inputModel is null)
            {
                throw new ArgumentNullException(nameof(inputModel));
            }

            var result = await _userService.RegisterAsync(inputModel);

            if (result is null)
            {
                throw new Exception("User not created");
            }

            var commonOutput = new CommonOutputType<string>()
            {
                ContextTitle = ContextTitle.USER,
                ContextSubTitle = ContextSubTitle.REGISTER,
                ContextStatus = ContextStatus.SUCCESS,
                Message = "User registered",
                Model = result!
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.USER,
                ContextSubTitle = ContextSubTitle.REGISTER,
                ContextStatus = ContextStatus.FAIL,
                Message = "Failed to register user",
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

    [AllowAnonymous]
    [HttpPost("GetUserProfile")]
    public async Task<ActionResult> GetUserProfileAsync([FromBody] GetUserProfileInputModel inputModel)
    {
        try
        {
            if (inputModel is null)
            {
                throw new ArgumentNullException(nameof(inputModel));
            }

            var result = await _userService.GetUserProfileAsync(inputModel.UserId);

            if (result is null)
            {
                throw new Exception("User not found");
            }

            var commonOutput = new CommonOutputType<UserProfileEntity>()
            {
                ContextTitle = ContextTitle.USER,
                ContextSubTitle = ContextSubTitle.PROFILE,
                ContextStatus = ContextStatus.SUCCESS,
                Message = "User found",
                Model = result!
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.USER,
                ContextSubTitle = ContextSubTitle.PROFILE,
                ContextStatus = ContextStatus.FAIL,
                Message = "Failed to get user",
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

    [AllowAnonymous]
    [HttpPost("GetUserHistory")]
    public async Task<ActionResult> GetUserHistory([FromBody] GetDignosisHistoryInputModel inputModel)
    {
        try
        {
            if (inputModel is null)
            {
                throw new ArgumentNullException(nameof(inputModel));
            }

            var result = await _userService.GetUserDiagnosisHistoryByUserIdAsync(inputModel.UserId);

            if (result is null)
            {
                throw new Exception("User History not available");
            }

            var commonOutput = new CommonOutputType<UserDiagnosisHistoryEntity>()
            {
                ContextTitle = ContextTitle.USER,
                ContextSubTitle = ContextSubTitle.HISTORY,
                ContextStatus = ContextStatus.SUCCESS,
                Message = "User History available",
                Model = result!
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.USER,
                ContextSubTitle = ContextSubTitle.HISTORY,
                ContextStatus = ContextStatus.FAIL,
                Message = "Failed to get User History",
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
