using Microsoft.AspNetCore.Mvc;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Enums;

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
		HttpContext.Items["CustomMessage"] = "Get all accounts successfully";
		return Ok(accounts);
	}

	/// <summary>
	/// Get account details by ID
	/// </summary>
	[HttpGet("{id}")]
	public async Task<IActionResult> GetAccountById(string id)
	{
		var account = await _accountService.GetAccountDetailById(id);
		if (account == null)
		{
			return NotFound("Account not found");
		}
		HttpContext.Items["CustomMessage"] = "Account found successfully";
		return Ok(account);
	}

	[HttpGet("{parentId}/student")]
	public async Task<IActionResult> GetStudentByParentId(string parentId)
	{
		var account = await _accountService.getStudentDetail(parentId);
		if (account == null)
		{
			return NotFound("Account not found");
		}
		HttpContext.Items["CustomMessage"] = "Account found successfully";
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
			return BadRequest(ModelState);
		}

		string id = await _accountService.CreateNewAccount(request);
		HttpContext.Items["CustomMessage"] = "Account created successfully";
		return CreatedAtAction(nameof(GetAccountById), new { id }, id);
	}

	/// <summary>
	/// Update existing account
	/// </summary>
	[HttpPut("{id}")]
	public async Task<IActionResult> UpdateAccount(string id, [FromBody] AccountUpdateRequest request)
	{
		if (!ModelState.IsValid)
		{
			return BadRequest(ModelState);
		}

		await _accountService.UpdateAccount(id, request);
		HttpContext.Items["CustomMessage"] = "Account updated successfully";
		return Ok();
	}

	/// <summary>
	/// Soft delete account
	/// </summary>
	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteAccount(string id)
	{
		await _accountService.SoftDeleteAccount(id);
		HttpContext.Items["CustomMessage"] = "Account deleted successfully";
		return Ok();
	}

	/// <summary>
	/// Change account status
	/// </summary>
	[HttpPatch("{id}/status")]
	public async Task<IActionResult> ChangeAccountStatus(string id, [FromQuery] AccountStatus status)
	{
		await _accountService.ChangeAccountStatus(id, status);
		HttpContext.Items["CustomMessage"] = "Account status changed successfully";
		return Ok();
	}

	[HttpPatch("assign-student")]
	public async Task<IActionResult> AssignStudentToParent([FromQuery] string studentId,string parentId)
	{
		var result = await _accountService.AssignStudentToParent(parentId, studentId);
		if (result)
		{
			HttpContext.Items["CustomMessage"] = "Link Student to Parent successfully";
			return Ok();
		}
		else
		{
			HttpContext.Items["CustomMessage"] = "Assign Student to Parent failed because they are not found or already linked or st";
			return BadRequest();
		}
	}

	/// <summary>
	/// Get all student accounts (no pagination)
	/// </summary>
	[HttpGet("students")]
	public async Task<IActionResult> GetAllStudentAccounts()
	{
		var students = await _accountService.GetAllStudentAccounts();
		HttpContext.Items["CustomMessage"] = "Get all student accounts successfully";
		return Ok(students);
	}
}
