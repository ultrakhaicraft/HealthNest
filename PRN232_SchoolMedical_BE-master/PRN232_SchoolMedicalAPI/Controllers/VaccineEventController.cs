using HealthNest_API.Helpers;
using HealthNest_BusinessLogic.Interface;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace HealthNest_API.Controllers;

[ApiController]
[Route("api/vaccine-event")]
[Authorize]
public class VaccineEventController : Controller
{
	private readonly IVaccineEventService _vaccineEventService;

	public VaccineEventController(IVaccineEventService vaccineEventService)
	{
		_vaccineEventService = vaccineEventService;
	}

	[HttpGet]
	public async Task<IActionResult> GetAllVaccineEvents([FromQuery] VaccineEventQuery request)
	{
		var result = await _vaccineEventService.GetAllVaccineEvents(request);
		ApiResponseWrapper<PagingModel<ViewVaccineEventDTO>> response = ApiResponseWrapper<PagingModel<ViewVaccineEventDTO>>
			.Success(result, "Get all vaccine events successfully");
		return Ok(response);
	}

	[HttpGet("{id}")]
	public async Task<IActionResult> GetVaccineEventById(string id)
	{
		var result = await _vaccineEventService.GetVaccineEventById(id);
		ApiResponseWrapper<ViewVaccineEventDetailDTO> response = ApiResponseWrapper<ViewVaccineEventDetailDTO>
			.Success(result, "Get vaccine event successfully with Id: " + id);

		return Ok(response);
	}

	[HttpPost]
	[Authorize(Roles = nameof(AccountRole.Admin))]
	public async Task<IActionResult> CreateVaccineEvent([FromBody] VaccineEventCreateDTO request)
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

		string createdById = User.Claims.GetUserIdFromJwtToken();

		var result = await _vaccineEventService.CreateVaccineEventAsync(request, createdById);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Created(result, "VaccineTitle event created successfully");

		return StatusCode(201, response);
	}

	[HttpPut("{id}")]
	[Authorize(Roles = nameof(AccountRole.Admin))]
	public async Task<IActionResult> UpdateVaccineEventById([FromBody] VaccineEventUpdateDTO request, string id)
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

	[HttpPatch("cancel/{id}")]
	[Authorize(Roles = nameof(AccountRole.Admin))]
	public async Task<IActionResult> CancelVaccineEvent(string id)
	{
		

		await _vaccineEventService.CancelVaccineEvent(id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Vaccine event cancel successfully with id: " + id);

		return Ok(response);
	}

	[HttpDelete("{id}")]
	[Authorize(Roles = nameof(AccountRole.Admin))]
	public async Task<IActionResult> DeleteVaccineEvent(string id)
	{

		await _vaccineEventService.DeleteVaccineEvent(id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Vaccine event deleted successfully");

		return Ok(response);
	}
}
