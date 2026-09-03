using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using PRN232_SchoolMedicalAPI.Helpers;
using SchoolMedical_BusinessLogic.Core;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;

namespace PRN232_SchoolMedicalAPI.Controllers;

[ApiController]
[Route("api/health-checkup")]
//[Authorize]
public class HealthCheckupEventController : Controller
{
	private readonly IHealthCheckupEventService _healthCheckupEventService;

	public HealthCheckupEventController(IHealthCheckupEventService healthCheckupEventService)
	{
		_healthCheckupEventService = healthCheckupEventService;
	}

	[HttpGet]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetAllHealthCheckupEvent([FromQuery] HealthCheckupEventQuery request)
	{
		var result = await _healthCheckupEventService.GetAllHealthCheckupEvent(request);
		ApiResponseWrapper<PagingModel<ViewHealthCheckupEventDTO>> response = ApiResponseWrapper<PagingModel<ViewHealthCheckupEventDTO>>
			.Success(result, "Get all health checkup events successfully");
		return Ok(response);
	}

	[HttpGet("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> GetHealthCheckupEventById(string id)
	{
		var result = await _healthCheckupEventService.GetHealthCheckupEventById(id);
		ApiResponseWrapper<HealthCheckupEventDetailDTO> response = ApiResponseWrapper<HealthCheckupEventDetailDTO>
			.Success(result, "Get  health checkup event successfully with Id: "+id);

		return Ok(response);
	}

	[HttpPost]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> CreateHealthCheckup([FromBody] HealthCheckupEventCreateDTO request)
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

		var result = await _healthCheckupEventService.CreateHealthCheckupAsync(request);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Created(result, "Health checkup event created successfully");

		return StatusCode(201, response);
	}

	[HttpPut("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> UpdateHealthCheckupById([FromBody] HealthCheckupEventUpdateDTO request, string id)
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

		var result = await _healthCheckupEventService.UpdateHealthCheckupEvent(request,id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(result, "Health checkup event updated successfully with id: "+id);

		return Ok(response);
	}

	[HttpDelete("{id}")]
	//[Authorize(Roles = "Admin")]
	public async Task<IActionResult> DeleteHealthCheckup(string id)
	{
	
		await _healthCheckupEventService.DeleteHealthCheckupEvent(id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(data:string.Empty,"Health checkup event deleted successfully");

		return Ok(response);
	}
}
