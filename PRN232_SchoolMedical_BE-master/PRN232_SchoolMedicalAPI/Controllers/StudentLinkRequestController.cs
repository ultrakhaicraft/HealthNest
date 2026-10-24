using HealthNest_BusinessLogic.Core;
using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthNest_API.Controllers;

[ApiController]
[Route("api/student-link-request")]
[Authorize]
public class StudentLinkRequestController : ControllerBase
{
	private readonly IStudentLinkRequestService _studentLinkRequestService;
	private string CurrentAccountId =>
	User.FindFirst("AccountId")?.Value
	?? throw new UnauthorizedException("Invalid token: missing account identifier");

	public StudentLinkRequestController(IStudentLinkRequestService studentLinkRequestService)
	{
		_studentLinkRequestService = studentLinkRequestService;
	}

	[HttpGet]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> GetAllStudentLink([FromQuery] StudentLinkRequestQuery request)
	{
		var result = await _studentLinkRequestService.GetAllStudentLinkRequest(request);
		ApiResponseWrapper<PagingModel<StudentLinkRequestViewModel>> response = ApiResponseWrapper<PagingModel<StudentLinkRequestViewModel>>
			.Success(result, "Get all student link request successfully");
		return Ok(response);
	}

	[HttpGet("{studentlinkRequestId}")]
	[Authorize(Roles = nameof(AccountRole.Parent)+","+nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> GetStudentLinkRequestModel([FromRoute] string studentlinkRequestId)
	{
		

		var result = await _studentLinkRequestService.GetStudentLinkRequestModel(studentlinkRequestId, CurrentAccountId);
		ApiResponseWrapper<StudentLinkRequestDetailModel> response = ApiResponseWrapper<StudentLinkRequestDetailModel>
			.Success(result, "Get student link request successfully with Id: "+ studentlinkRequestId);
		return Ok(response);
	}

	[HttpGet("my-requests")]
	[Authorize(Roles = nameof(AccountRole.Parent))]
	public async Task<IActionResult> GetMyLinkStudentRequest([FromQuery] StudentLinkRequestQuery request)
	{
		

		var result = await _studentLinkRequestService.GetMyRequestsAsync(CurrentAccountId, request);
		ApiResponseWrapper<PagingModel<StudentLinkRequestViewModel>> response = ApiResponseWrapper<PagingModel<StudentLinkRequestViewModel>>
			.Success(result, "Get student link request successfully with parent Id: " + CurrentAccountId);

		return Ok(response);
	}

	[HttpPost("submit")]
	[Authorize(Roles = nameof(AccountRole.Parent))]
	public async Task<IActionResult> SubmitStudentLinkRequest( [FromBody] LinkRequestCreateModel request)
	{
		

		

		await _studentLinkRequestService.SubmitAsync(CurrentAccountId, request);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Created(string.Empty, "Student Link Request submitted successfully");

		return StatusCode(201, response);
	}

	[HttpPatch("cancel/{studentlinkRequestId}")]
	[Authorize(Roles = nameof(AccountRole.Parent))]
	public async Task<IActionResult> CancelLink([FromRoute] string studentlinkRequestId)
	{
		

		await _studentLinkRequestService.CancelAsync(CurrentAccountId, studentlinkRequestId);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Student Link Request cancelled successfully with id: " + studentlinkRequestId);

		return Ok(response);
	}

	[HttpPatch("approve/{studentlinkRequestId}")]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> ApproveLink([FromRoute] string studentlinkRequestId)
	{
		


		await _studentLinkRequestService.ApproveAsync(CurrentAccountId, studentlinkRequestId);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Student Link Request approved successfully with id: " + studentlinkRequestId);

		return Ok(response);
	}

	[HttpPatch("reject/{studentlinkRequestId}")]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> RejectLink([FromRoute] string studentlinkRequestId, [FromQuery] LinkRequestCancelRequest request)	
	{
		

		await _studentLinkRequestService.RejectAsync(CurrentAccountId, studentlinkRequestId, request.RejectionReason);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Student Link Request reject successfully with id: " + studentlinkRequestId);

		return Ok(response);
	}
}
