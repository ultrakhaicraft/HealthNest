using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using PRN232_SchoolMedicalAPI.Helpers;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;


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
			return BadRequest();
		}
		var response = await _authService.Login(request);
		HttpContext.Items["CustomMessage"] = "Login successfully, granting token";
		return Ok(response);
	}

	

	[AllowAnonymous]
	[HttpPost("register")]
	public async Task<IActionResult> RegisterAsParent([FromBody] RegisterRequest request, bool IsParent)
	{
		if (!ModelState.IsValid)
		{
			return BadRequest();
		}
		var response = await _authService.RegisteAsync(request, IsParent);
		HttpContext.Items["CustomMessage"] = "User registered successfully!"; 
		return Ok(response);

	}
}
