using Microsoft.AspNetCore.Mvc;
using SchoolMedical_BusinessLogic.Core;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;

namespace PRN232_SchoolMedicalAPI.Controllers;

[ApiController]
[Route("api/vaccine-event")]
//[Authorize]
public class VaccineEventController : Controller
{
	private readonly IVaccineEventService _vaccineEventService;

	public VaccineEventController(IVaccineEventService vaccineEventService)
	{
		_vaccineEventService = vaccineEventService;
	}

	[HttpGet]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetAllVaccineEvents([FromQuery] VaccineEventQuery request)
	{
		var result = await _vaccineEventService.GetAllVaccineEvents(request);
		ApiResponseWrapper<PagingModel<ViewVaccineEventDTO>> response = ApiResponseWrapper<PagingModel<ViewVaccineEventDTO>>
			.Success(result, "Get all vaccine events successfully");
		return Ok(response);
	}

	[HttpGet("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetVaccineEventById(string id)
	{
		var result = await _vaccineEventService.GetVaccineEventById(id);
		ApiResponseWrapper<ViewVaccineEventDetailDTO> response = ApiResponseWrapper<ViewVaccineEventDetailDTO>
			.Success(result, "Get vaccine event successfully with Id: " + id);

		return Ok(response);
	}

	[HttpPost]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> CreateHealthCheckup([FromBody] VaccineEventCreateDTO request)
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

		var result = await _vaccineEventService.CreateVaccineEventAsync(request);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Created(result, "Vaccine event created successfully");

		return StatusCode(201, response);
	}

	[HttpPut("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> UpdateHealthCheckupById([FromBody] VaccineEventUpdateDTO request, string id)
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

		var result = await _vaccineEventService.UpdateVaccineEvent(request, id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(result, "Vaccine event updated successfully with id: " + id);

		return Ok(response);
	}

	[HttpDelete("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> DeleteHealthCheckup(string id)
	{

		await _vaccineEventService.DeleteVaccineEvent(id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.NoContent("Vaccine event deleted successfully");

		return StatusCode(204, response);
	}
}
