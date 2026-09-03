using Microsoft.AspNetCore.Mvc;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using System.Security.Principal;

namespace PRN232_SchoolMedicalAPI.Controllers;

[ApiController]
[Route("api/account")]
//[Authorize]
public class AccountController : ControllerBase
{
	private readonly IAccountService _accountService;
	public AccountController(IAccountService accountService)
	{
		_accountService = accountService;
	}

	/// <summary>
	/// Get paginated list of accounts with filtering and sorting
	/// </summary>
	[HttpGet]
	public async Task<IActionResult> GetAccounts([FromQuery] AccountQuery request)
	{
		var accounts = await _accountService.GetAllAccount(request);
		ApiResponseWrapper<PagingModel<AccountViewModel>> response = ApiResponseWrapper<PagingModel<AccountViewModel>>
			.Success(accounts, "Get all accounts successful");
		return Ok(response);
	}

	/// <summary>
	/// Get account details by ID
	/// </summary>
	[HttpGet("{id}")]
	public async Task<IActionResult> GetAccountById(string id)
	{
		var account = await _accountService.GetAccountDetailById(id);
		
		ApiResponseWrapper<AccountDetailModel> response = ApiResponseWrapper<AccountDetailModel>
			.Success(account, "Get account successfully with Id: "+id);

		return Ok(account);
	}

	[HttpGet("{parentId}/student")]
	public async Task<IActionResult> GetStudentByParentId(string parentId)
	{
		var account = await _accountService.getStudentDetail(parentId);
		ApiResponseWrapper<AccountDetailModel> response = ApiResponseWrapper<AccountDetailModel>
			.Success(account, "Get Student account successfully with Parent Id: " + parentId);
		return Ok(account);
	}

	/// <summary>
	/// Create new account
	/// </summary>
	[HttpPost]
	public async Task<IActionResult> CreateAccount([FromBody] AccountCreateRequest request)
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

		string id = await _accountService.CreateNewAccount(request);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Created(id, "Create Account Success, giving Id");

		return StatusCode(201, response);
	}

	/// <summary>
	/// Update existing account
	/// </summary>
	[HttpPut("{id}")]
	public async Task<IActionResult> UpdateAccount(string id, [FromBody] AccountUpdateRequest request)
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

		await _accountService.UpdateAccount(id, request);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Update Account Success with Id - "+id); 

		return Ok(response);
	}

	/// <summary>
	/// Soft delete account
	/// </summary>
	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteAccount(string id)
	{
		await _accountService.SoftDeleteAccount(id);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(data:string.Empty,"Delete Account Success with Id - " + id);
		return Ok(response);
	}

	/// <summary>
	/// Change account status
	/// </summary>
	[HttpPatch("{id}/status")]
	public async Task<IActionResult> ChangeAccountStatus(string id, [FromQuery] AccountStatus status)
	{
		await _accountService.ChangeAccountStatus(id, status);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Change Account status Success with Id - " + id);

		return Ok(response);
	}

	[HttpPatch("assign-student")]
	public async Task<IActionResult> AssignStudentToParent([FromQuery] string studentId,string parentId)
	{
		var result = await _accountService.AssignStudentToParent(parentId, studentId);
		if (result)
		{
			HttpContext.Items["CustomMessage"] = "Link Student to Parent successfully";
			ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Link Student to Parent successfully");

			return Ok(response);
		}
		else
		{
			ApiResponseWrapper<string> response = ApiResponseWrapper<string>
								.ErrorResponse(400, "Assign Student to Parent failed", "No further detail");	
			return BadRequest();
		}
	}

	
}
