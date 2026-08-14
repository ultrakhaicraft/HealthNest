using Microsoft.AspNetCore.Mvc;
using SchoolMedical_BusinessLogic.Core;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;

namespace PRN232_SchoolMedicalAPI.Controllers;


//Handle dashboard related feature
[ApiController]
[Route("api/[controller]")]
public class DashboardController : Controller
{
	private readonly IIncidentRecordService _incidentRecordService;
	private readonly IMedicineRequestService _medicineRequestService;
	private readonly IHealthCheckupEventService _healthCheckupEventService;
	private readonly IVaccineEventService _vaccineEventService;

	public DashboardController(IIncidentRecordService incidentRecordService, IMedicineRequestService medicineRequestService, IHealthCheckupEventService healthCheckupEventService, IVaccineEventService vaccineEventService)
	{
		_incidentRecordService = incidentRecordService;
		_medicineRequestService = medicineRequestService;
		_healthCheckupEventService = healthCheckupEventService;
		_vaccineEventService = vaccineEventService;
	}

	[HttpGet("statistics")]
	public async Task<IActionResult> GetStatistic()
	{
		DashboardStatistic stat = new DashboardStatistic();
		stat.ActiveIncidentRecord = await _incidentRecordService.CountActiveIncidentRecord();
		stat.PendingMedicineRequest = await _medicineRequestService.CountPendingMedicineRequest();
		stat.UpcomingVaccineEvent = await _vaccineEventService.CountUpcomingVaccineEvent();
		stat.UpcomingHealthCheckup = await _healthCheckupEventService.CountUpcomingHealthCheckup();

		return Ok(stat);
	}

	/// <summary>
	/// Incident Report per month given a specific year
	/// </summary>
	/// <returns></returns>
	[HttpGet("count-all-incident-per-year")]
	public async Task<IActionResult> CountIncidentRecordPerYear([FromQuery] int year)
	{
		var result = await _incidentRecordService.CountAllIncidentRecordPerYear(year);
		return Ok(result);
	}

}
