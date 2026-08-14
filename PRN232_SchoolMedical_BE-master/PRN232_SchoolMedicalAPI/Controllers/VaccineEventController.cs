using Microsoft.AspNetCore.Mvc;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;

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
	public async Task<IActionResult> GetAllVaccineEvents([FromQuery] VaccineEventQuery request)
	{
		var vaccineEvents = await _vaccineEventService.GetAllVaccineEvents(request);
		HttpContext.Items["CustomMessage"] = "Get all vaccine events successfully";
		return Ok(vaccineEvents);
	}
}
