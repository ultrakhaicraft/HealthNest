using HealthNest_BusinessLogic.Core;
using HealthNest_BusinessLogic.Interface;
using HealthNest_DAO.DTOModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HealthNest_API.Controllers;

[ApiController]
[Route("api/vaccine-record")]
[Authorize]
public class VaccineRecordController : Controller
{
	private readonly IVaccineRecordService _vaccineRecordService;

	public VaccineRecordController(IVaccineRecordService vaccineRecordService)
	{
		_vaccineRecordService = vaccineRecordService;
	}

	[HttpGet]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetAllVaccineRecordAsync([FromQuery] VaccineRecordQuery request)
	{
		var result = await _vaccineRecordService.GetAllVaccineRecordAsync(request);
		ApiResponseWrapper<PagingModel<VaccineRecordViewModel>> response = ApiResponseWrapper<PagingModel<VaccineRecordViewModel>>
			.Success(result, "Get all vaccine record successfully");
		return Ok(response);
	}

	[HttpGet("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetVaccineRecordByIdAsync(string id)
	{
		var result = await _vaccineRecordService.GetVaccineRecordByIdAsync(id);
		ApiResponseWrapper<VaccineRecordViewModel> response = ApiResponseWrapper<VaccineRecordViewModel>
			.Success(result, "Get vaccine record successfully with Id: " + id);

		return Ok(response);
	}

	[HttpPost("{studentHealthRecordId}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> CreateHealthCheckup([FromRoute] string studentHealthRecordId,[FromBody] List<VaccineRecordCreateModel request)
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

		 await _vaccineRecordService.AddVaccineRecordsByStudentHealthRecordIdAsync(request, studentHealthRecordId);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Created(string.Empty, "Vaccine record created successfully");

		return StatusCode(201, response);
	}

	[HttpPut("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> UpdateVaccineRecordById([FromBody] VaccineRecordUpdateModel request, string id)
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

		await _vaccineRecordService.UpdateVaccineRecordAsync(request, id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Vaccine record updated successfully with id: " + id);

		return Ok(response);
	}

	[HttpDelete("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> RemoveVaccineRecord(string id)
	{

		await _vaccineRecordService.RemoveVaccineRecordAsync(id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(data: string.Empty, "Vaccine Record deleted successfully");

		return Ok(response);
	}
}
