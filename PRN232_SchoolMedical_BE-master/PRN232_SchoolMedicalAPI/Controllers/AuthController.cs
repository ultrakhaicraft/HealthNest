using HealthNest_BusinessLogic.Interface;
using HealthNest_DAO.DTOModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Security.Claims;


namespace HealthNest_API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
	private readonly IAuthService _authService;
	private readonly IConfigurationSection jwtSettings;

	public AuthController(IAuthService authService, IConfiguration configuration)
	{
		_authService = authService;
		jwtSettings = configuration.GetSection("JwtSettings"); 
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


		(LoginResponse, TokensDTO) result = await _authService.Login(request);

		Response.Cookies.Append("access_token", result.Item2!.AccessTokenString!, new CookieOptions
		{
			HttpOnly = true,                 // JS cannot read it
			Secure = true,                   // HTTPS only
			SameSite = SameSiteMode.Lax,  // or Lax if front/back are on different sites
			Expires = DateTimeOffset.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["AccessTokenExpiryMinutes"])),
			Path = "/"
		});

		Response.Cookies.Append("refresh_token", result.Item2!.RefreshTokenString!, new CookieOptions
		{
			HttpOnly = true,                 
			Secure = true,                   
			SameSite = SameSiteMode.Lax,  
			Expires = DateTimeOffset.UtcNow.AddDays(Convert.ToDouble(jwtSettings["RefreshTokenExpiryDays"])),
			Path = "/api/auth/refresh"
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
		var result = await _authService.RegisterAsync(request, IsParent);
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
			SameSite = SameSiteMode.Lax,
			Path = "/"
		});

		Response.Cookies.Delete("refresh_token", new CookieOptions
		{
			HttpOnly = true,
			Secure = true,
			SameSite = SameSiteMode.Lax,
			Path = "/api/auth/refresh"
		});

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Logout Successful");
		return Ok(response);
	}

	[Authorize]
	[HttpGet("me")]
	//The main purpose is to read the cookie
	public IActionResult Me()
	{
		var UserAuthenticationResponse = new ApiResponseWrapper<object>
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
		return Ok(UserAuthenticationResponse);
	}

	[HttpGet("refresh")]
	[AllowAnonymous]
	//Get new access token by using refresh token
	public async Task<IActionResult> RefreshAccessToken()
	{
		var requestTokens = new TokensDTO
		{
			AccessTokenString = Request.Cookies["access_token"] ?? string.Empty,
			RefreshTokenString = Request.Cookies["refresh_token"] ?? string.Empty
		};

		TokensDTO result = await _authService.RefreshToken(requestTokens);

		Response.Cookies.Append("access_token", result.AccessTokenString!, new CookieOptions
		{
			HttpOnly = true,                
			Secure = true,                  
			SameSite = SameSiteMode.Lax, 
			Expires = DateTimeOffset.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["AccessTokenExpiryMinutes"])),
			Path = "/"
		});

		Response.Cookies.Append("refresh_token", result.RefreshTokenString!, new CookieOptions
		{
			HttpOnly = true,
			Secure = true,
			SameSite = SameSiteMode.Lax,
			Expires = DateTimeOffset.UtcNow.AddDays(Convert.ToDouble(jwtSettings["RefreshTokenExpiryDays"])),
			Path = "/api/auth/refresh"
		});


		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Refresh token success, they are now append to cookies");

		return Ok(response);
	}
}
