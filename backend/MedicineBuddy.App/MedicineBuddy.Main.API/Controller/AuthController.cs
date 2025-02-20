using MedicineBuddy.Main.API.Models;
using System.Net;
using MedicineBuddy.Main.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MedicineBuddy.Main.API.Entities;
using Microsoft.AspNetCore.Authorization;

namespace MedicineBuddy.Main.API.Controller;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly IAuthService _authService;

    public AuthController(ILogger<AuthController> logger, IAuthService authService)
    {
        _logger = logger;
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("Login")]
    public async Task<ActionResult> Login([FromBody] UserLoginInputModel inputModel)
    {
        try
        {
            if (inputModel is null)
            {
                throw new ArgumentNullException(nameof(inputModel));
            }

            // check credentials is valid or not 
            var userEntity = await _authService.GetUserByUserNameAsync(inputModel.UserName);

            if (userEntity is null)
            {
                throw new Exception("Username incorrect");
            }
            //check if password is correct or not
            if (inputModel.Password != userEntity.PasswordEncrypted)
            {
                throw new Exception("Password incorrect");
            }

            // create token
            var token = _authService.CreateToken(userEntity);
            // create refreshtoken
            var refreshToken = _authService.CreateRefreshToken();
            //save refresh token
            var isRefreshTokenSaved = await _authService.SaveRefreshTokenAsync(userEntity.UserName, refreshToken);

            if (!isRefreshTokenSaved)
            {
                throw new Exception("RefreshToken saving failed");
            }

            var commonOutput = new CommonOutputType<AuthTokenOutputModel>()
            {
                ContextTitle = ContextTitle.USER,
                ContextSubTitle = ContextSubTitle.LOGIN,
                ContextStatus = ContextStatus.SUCCESS,
                Message = "success to generate token",
                Model = new AuthTokenOutputModel()
                {
                    UserId = userEntity.Id,
                    UserName = inputModel.UserName,
                    Token = token,
                    RefreshToken = refreshToken,
                }
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.AUTH,
                ContextSubTitle = ContextSubTitle.LOGIN,
                ContextStatus = ContextStatus.FAIL,
                Message = "Failed to generate token",
                Model = new ProblemDetails()
                {
                    Title = ex.Message,
                    Detail = ex.StackTrace,
                    Status = (int)HttpStatusCode.Unauthorized,
                }
            };
            return Unauthorized(commonOutput);
        }
    }

    [AllowAnonymous]
    [HttpPost("RefreshToken")]
    public async Task<ActionResult> RefreshTokenAsync([FromBody] AuthRefreshTokenInputModel inputModel)
    {
        try
        {
            if (string.IsNullOrEmpty(inputModel.Token) || string.IsNullOrEmpty(inputModel.RefreshToken))
            {
                throw new Exception("Token or RefreshToken is empty");
            }

            // get claim info from token 
            var claims = _authService.GetClaimsFromExpiredToken(inputModel.Token);
            if (claims is null)
            {
                throw new Exception("invalid token");
            }

            // check if username & regsresh token validity
            var userName = claims.Identity!.Name;
            var userEntity = await _authService.GetUserByUserNameAsync(userName!);
            if (userEntity is null)
            {
                throw new Exception("invalid UserName");
            }
            var isRefreshTokenValid = _authService.IsRefreshTokenValid(inputModel.RefreshToken, userEntity.RefreshToken);
            if (!isRefreshTokenValid)
            {
                throw new Exception("invalid RefreshToken");
            }

            // create token
            var token = _authService.CreateToken(userEntity);
            // create refreshtoken
            var refreshToken = _authService.CreateRefreshToken();
            //save refresh token
            var isRefreshTokenSaved = await _authService.SaveRefreshTokenAsync(userName, refreshToken);

            if (!isRefreshTokenSaved)
            {
                throw new Exception("RefreshToken saving failed");
            }

            var commonOutput = new CommonOutputType<AuthTokenOutputModel>()
            {
                ContextTitle = ContextTitle.USER,
                ContextSubTitle = ContextSubTitle.REFRESHTOKEN,
                ContextStatus = ContextStatus.SUCCESS,
                Message = "success to generate refresh token",
                Model = new AuthTokenOutputModel()
                {
                    UserId = userEntity.Id,
                    UserName = userName!,
                    Token = token,
                    RefreshToken = refreshToken,
                }
            };
            return Ok(commonOutput);

        }
        catch (Exception ex)
        {
            var commonOutput = new CommonOutputType<ProblemDetails>()
            {
                ContextTitle = ContextTitle.AUTH,
                ContextSubTitle = ContextSubTitle.REFRESHTOKEN,
                ContextStatus = ContextStatus.FAIL,
                Message = "Failed to generate refresh token",
                Model = new ProblemDetails()
                {
                    Title = ex.Message,
                    Detail = ex.StackTrace,
                    Status = (int)HttpStatusCode.Unauthorized,
                }
            };
            return Unauthorized(commonOutput);
        }
    }

}
