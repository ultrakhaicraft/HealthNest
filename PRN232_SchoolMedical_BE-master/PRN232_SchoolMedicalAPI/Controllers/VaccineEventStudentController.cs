using HealthNest_API.Helpers;
using HealthNest_BusinessLogic.Interface;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Data;

namespace HealthNest_API.Controllers;


[ApiController]
[Route("vaccine-event-participant")]
public class VaccineEventStudentController : Controller
{
	private readonly IVaccineEventStudentService _vaccineEventStudentService;

	public VaccineEventStudentController(IVaccineEventStudentService vaccineEventStudentService)
	{
		_vaccineEventStudentService = vaccineEventStudentService;
	}

	// ---------- Parent ----------

	[HttpPost("{eventId}/signups")]
	[Authorize(Roles = nameof(AccountRole.Parent))]
	public async Task<IActionResult> SignUpStudent([FromBody] CreateVaccineEventStudentModel request)
	{
		if (!ModelState.IsValid)
			return ValidationErrorResponse();

		string parentId = User.Claims.GetUserIdFromJwtToken();

		await _vaccineEventStudentService.SignUpStudentAsync(request, parentId);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Created(string.Empty, "Student with id: "+request.StudentId+" signed up successfully for vaccine event with id: " +request.VaccineEventId );

		return StatusCode(201, response);
	}

	[HttpPatch("{eventId}/signups/{studentId}/cancel")]
	[Authorize(Roles = nameof(AccountRole.Parent))]
	public async Task<IActionResult> CancelSignUp(string eventId, string studentId)
	{

		await _vaccineEventStudentService.CancelSignUp(eventId, studentId);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Success(string.Empty, "Sign-up cancelled successfully for vaccine event with id: " + eventId + " for Student with id: "+ studentId );

		return Ok(response);
	}

	[HttpGet("parents/me/signups")]
	[Authorize(Roles = nameof(AccountRole.Parent))]
	public async Task<IActionResult> GetSignUpsByParent([FromQuery] VaccineEventStudentQuery request)
	{
		string parentId = User.Claims.GetUserIdFromJwtToken();

		var result = await _vaccineEventStudentService.FindVaccineEventStudentByParentId(parentId, request);

		ApiResponseWrapper<PagingModel<ViewVaccineEventStudentModel>> response =
			ApiResponseWrapper<PagingModel<ViewVaccineEventStudentModel>>
				.Success(result, "Get children's vaccine event sign-ups successfully");

		return Ok(response);
	}

	// ---------- Student ----------

	[HttpGet("students/me/signups")]
	[Authorize(Roles = nameof(AccountRole.Student))]
	public async Task<IActionResult> GetMySignUps([FromQuery] VaccineEventStudentQuery request)
	{
		string studentId = User.Claims.GetUserIdFromJwtToken();

		var result = await _vaccineEventStudentService.FindVaccineEventStudentByStudentId(studentId, request);

		ApiResponseWrapper<PagingModel<ViewVaccineEventStudentModel>> response =
			ApiResponseWrapper<PagingModel<ViewVaccineEventStudentModel>>
				.Success(result, "Get my vaccine event sign-ups successfully");

		return Ok(response);
	}

	// ---------- Nurse ----------

	[HttpGet("{eventId}/students")]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> GetStudentsByEventId(string eventId, [FromQuery] VaccineEventStudentQuery request)
	{
		var result = await _vaccineEventStudentService.FindVaccineEventStudentByEventId(eventId, request);

		ApiResponseWrapper<PagingModel<ViewVaccineEventStudentModel>> response =
			ApiResponseWrapper<PagingModel<ViewVaccineEventStudentModel>>
				.Success(result, "Get students of vaccine event successfully with id: " + eventId);

		return Ok(response);
	}

	[HttpGet("students/{studentId}/signups")]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> GetSignUpsByStudentId(string studentId, [FromQuery] VaccineEventStudentQuery request)
	{
		var result = await _vaccineEventStudentService.FindVaccineEventStudentByStudentId(studentId, request);

		ApiResponseWrapper<PagingModel<ViewVaccineEventStudentModel>> response =
			ApiResponseWrapper<PagingModel<ViewVaccineEventStudentModel>>
				.Success(result, "Get vaccine event sign-ups successfully for student with id: " + studentId);

		return Ok(response);
	}

	[HttpPatch("{eventId}/students/{studentId}/approve")]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> ApproveStudent(string eventId, string studentId)
	{
		string nurseId = User.Claims.GetUserIdFromJwtToken();

		await _vaccineEventStudentService.ApproveStudentToVaccineEventAsync(eventId, studentId, nurseId);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Success(string.Empty, "Student approved successfully with id: " + studentId);

		return Ok(response);
	}

	[HttpPatch("{eventId}/students/{studentId}/reject")]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> RejectStudent(string eventId, string studentId)
	{
		string nurseId = User.Claims.GetUserIdFromJwtToken();

		await _vaccineEventStudentService.RejectStudentFromVaccineEventAsync(eventId, studentId, nurseId);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Success(string.Empty, "Student rejected successfully with id: " + studentId);

		return Ok(response);
	}

	[HttpPatch("{eventId}/students/{studentId}/complete")]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> CompleteStudentVaccination(string eventId, string studentId,
		[FromBody] CompleteVaccinationRequest request)
	{
		if (!ModelState.IsValid)
			return ValidationErrorResponse();

		string nurseId = User.Claims.GetUserIdFromJwtToken();

		await _vaccineEventStudentService.CompleteStudentVaccineEventAsync(
			eventId, studentId, nurseId, request.ResultSummary);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Success(string.Empty, "Vaccination recorded successfully for student with id: " + studentId);

		return Ok(response);
	}

	[HttpPatch("{eventId}/students/{studentId}/note")]
	[Authorize(Roles = nameof(AccountRole.SchoolNurse))]
	public async Task<IActionResult> UpdateNote(string eventId, string studentId,
		[FromBody] UpdateNoteRequest request)
	{
		if (!ModelState.IsValid)
			return ValidationErrorResponse();

		await _vaccineEventStudentService.UpdateNote(eventId, studentId, request.Note);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Success(string.Empty, "Note updated successfully for student with id: " + studentId);

		return Ok(response);
	}


	// ---------- Shared  ----------

	[HttpGet("{eventId}/students/{studentId}")]
	[Authorize()]
	public async Task<IActionResult> GetVaccineEventStudentDetail(string eventId, string studentId)
	{
		string requesterId = User.Claims.GetUserIdFromJwtToken();

		var result = await _vaccineEventStudentService.ViewVaccineEventStudentDetail(
			eventId, studentId);

		ApiResponseWrapper<ViewVaccineEventStudentDetailModel> response =
			ApiResponseWrapper<ViewVaccineEventStudentDetailModel>
				.Success(result, "Get vaccine event sign-up successfully for student with id: " + studentId);

		return Ok(response);
	}

	private IActionResult ValidationErrorResponse()
	{
		var errors = ModelState
			.Where(kvp => kvp.Value?.Errors.Count > 0)
			.ToDictionary(
				kvp => kvp.Key,
				kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
			);

		return BadRequest(ApiResponseWrapper<object>.ValidationError(errors));
	}
}
