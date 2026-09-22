using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using PRN232_SchoolMedicalAPI.Helpers;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using System.Security.Claims;


namespace PRN232_SchoolMedicalAPI.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
	private readonly IAuthService _authService;

	public AuthController(IAuthService authService)
	{
		_authService = authService;
	}

	[HttpPost("login")]
	[AllowAnonymous]
	public async Task<IActionResult> Login([FromBody] LoginRequest request)
	{
		if (!ModelState.IsValid)
		{
			var errors = ModelState
			.Where(kvp => kvp.Value?.Errors.Count > 0)
			.ToDictionary(
				kvp => kvp.Key,
				kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
			);

			return BadRequest(ApiResponseWrapper<object>.ValidationError(errors));
		}


		(LoginResponse, JWTToken) result = await _authService.Login(request);

		Response.Cookies.Append("access_token", result.Item2!.TokenString!, new CookieOptions
		{
			HttpOnly = true,                 // JS cannot read it
			Secure = true,                   // HTTPS only
			SameSite = SameSiteMode.None,  // or Lax if front/back are on different sites
			Expires = DateTimeOffset.UtcNow.AddMinutes(60),
			Path = "/"
		});


		ApiResponseWrapper<LoginResponse> response = ApiResponseWrapper<LoginResponse>
					.Success(result.Item1, "Login Success"); 

		return Ok(response);
	}

	

	
	[HttpPost("register")]
	[AllowAnonymous]
	public async Task<IActionResult> Register([FromBody] RegisterRequest request, bool IsParent)
	{
		if (!ModelState.IsValid)
		{
			var errors = ModelState
			.Where(kvp => kvp.Value?.Errors.Count > 0)
			.ToDictionary(
				kvp => kvp.Key,
				kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
			);

			return BadRequest(ApiResponseWrapper<object>.ValidationError(errors));
		}
		var result = await _authService.RegisteAsync(request, IsParent);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Created(result, "Register Success");
		return StatusCode(StatusCodes.Status201Created, response);

	}

	[HttpPost("logout")]
	[AllowAnonymous]
	public IActionResult Logout()
	{
		Response.Cookies.Delete("access_token", new CookieOptions
		{
			HttpOnly = true,
			Secure = true,
			SameSite = SameSiteMode.None,
			Path = "/"
		});
		return Ok();
	}

	[Authorize]
	[HttpGet("me")]
	//The main purpose is to read the cookie
	public IActionResult Me()
	{
		var UserAuthenticationContent = new ApiResponseWrapper<object>
		{
			StatusCode = StatusCodes.Status200OK,
			Message = "Reading Cookies Success, retriving user content",
			Data = new
			{
				Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
				Role = User.FindFirst(ClaimTypes.Role)?.Value,
				FullName = User.FindFirst("fullName")?.Value
			}
		};
		return Ok(UserAuthenticationContent);
	}
}
