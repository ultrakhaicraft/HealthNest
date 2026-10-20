using HealthNest_BusinessLogic.Core;
using HealthNest_BusinessLogic.Interface;
using HealthNest_DAO.DTOModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthNest_API.Controllers;

[ApiController]
[Route("api/treatment-record")]
[Authorize]
public class TreatmentRecordController : Controller
{

	private readonly ITreatmentRecordService _treatmentRecordService;

	public TreatmentRecordController(ITreatmentRecordService treatmentRecordService)
	{
		_treatmentRecordService = treatmentRecordService;
	}

	[HttpGet]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetAllVaccineRecordAsync([FromQuery] TreatmentRecordQuery request)
	{
		var result = await _treatmentRecordService.GetAllTreatmentRecordAsync(request);
		ApiResponseWrapper<PagingModel<TreatmentRecordViewModel>> response = ApiResponseWrapper<PagingModel<TreatmentRecordViewModel>>
			.Success(result, "Get all treament record successfully");
		return Ok(response);
	}

	[HttpGet("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetVaccineRecordByIdAsync(string id)
	{
		var result = await _treatmentRecordService.GetTreatmentRecordByIdAsync(id);
		ApiResponseWrapper<TreatmentRecordViewModel> response = ApiResponseWrapper<TreatmentRecordViewModel>
			.Success(result, "Get treament record successfully with Id: " + id);

		return Ok(response);
	}

	[HttpPost("{studentHealthRecordId}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> CreateTreatmentRecord([FromRoute] string studentHealthRecordId, [FromBody] List<TreatmentRecordCreateModel> request)
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

		await _treatmentRecordService.AddTreatmentRecordsByStudentHealthRecordIdAsync(request, studentHealthRecordId);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Created(string.Empty, "Treatment record created successfully");

		return StatusCode(201, response);
	}

	[HttpPut("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> UpdateTreatmentRecordById([FromBody] TreatmentRecordUpdateModel request, string id)
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

		await _treatmentRecordService.UpdateTreatmentRecordAsync(request, id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Treatment record updated successfully with id: " + id);

		return Ok(response);
	}

	[HttpDelete("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> RemoveTreatmentRecord(string id)
	{

		await _treatmentRecordService.RemoveTreatmentRecordAsync(id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(data: string.Empty, "Treatment Record deleted successfully");

		return Ok(response);
	}
}
