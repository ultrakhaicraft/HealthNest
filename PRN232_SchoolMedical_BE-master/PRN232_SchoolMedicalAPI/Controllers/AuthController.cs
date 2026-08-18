using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using PRN232_SchoolMedicalAPI.Helpers;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;


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

	[AllowAnonymous]
	[HttpPost("login")]
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
		var result = await _authService.Login(request);
		ApiResponseWrapper<LoginResponse> response = ApiResponseWrapper<LoginResponse>
					.Success(result, "Login Success"); 
		return Ok(response);
	}

	

	[AllowAnonymous]
	[HttpPost("register")]
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
}
