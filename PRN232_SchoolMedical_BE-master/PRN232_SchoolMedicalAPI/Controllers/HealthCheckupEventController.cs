using Microsoft.AspNetCore.Mvc;
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
	public async Task<IActionResult> GetAllHealthCheckupEvent([FromQuery] HealthCheckupEventQuery request)
	{
		var healthCheckupEvents = await _healthCheckupEventService.GetAllHealthCheckupEvent(request);
		HttpContext.Items["CustomMessage"] = "Get all health checkup events successfully";
		return Ok(healthCheckupEvents);
	}
}
