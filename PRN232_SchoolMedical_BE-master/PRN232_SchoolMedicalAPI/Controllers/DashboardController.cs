using HealthNest_API.Helpers;
using HealthNest_BusinessLogic.Interface;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;


namespace HealthNest_API.Controllers;


//Handle dashboard related feature
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : Controller
{
	private readonly IIncidentRecordService _incidentRecordService;
	private readonly IMedicineRequestService _medicineRequestService;
	private readonly IHealthCheckupEventService _healthCheckupEventService;
	private readonly IVaccineEventService _vaccineEventService;
	private readonly IAccountService _accountService;

	public DashboardController(IIncidentRecordService incidentRecordService, IMedicineRequestService medicineRequestService, IHealthCheckupEventService healthCheckupEventService, IVaccineEventService vaccineEventService, IAccountService accountService)
	{
		_incidentRecordService = incidentRecordService;
		_medicineRequestService = medicineRequestService;
		_healthCheckupEventService = healthCheckupEventService;
		_vaccineEventService = vaccineEventService;
		_accountService = accountService;
	}

	[HttpGet("statistics")]
	public async Task<IActionResult> GetStatistic()
	{
		//Get Role from request or cookie
		//If the role is Admin, get statistic related to user count, otherwise do not get it
		string userRole = User.Claims.GetUserRoleFromJwtToken();

		UserCountStatistic? userStat = null; //Prevent double new constructor in GetUserStatistic

		if (userRole == AccountRole.Admin.ToString())
		{
			userStat = await _accountService.GetUserStatistic();
		}
		else
		{
			userStat = new UserCountStatistic
			{
				TotalParent = 0,
				TotalStudent = 0,
				TotalSchoolNurse = 0,
				TotalDailyUser = 0	
			};
		}


		DashboardStatistic result = new DashboardStatistic { UserCountStatistic = userStat };

		result.ActiveIncidentRecord = await _incidentRecordService.CountActiveIncidentRecord();
		result.PendingMedicineRequest = await _medicineRequestService.CountPendingMedicineRequest();
		result.UpcomingVaccineEvent = await _vaccineEventService.CountUpcomingVaccineEvent();
		result.UpcomingHealthCheckup = await _healthCheckupEventService.CountUpcomingHealthCheckup();

		ApiResponseWrapper<DashboardStatistic> response = ApiResponseWrapper<DashboardStatistic>
			.Success(result, "Get all dashboard statistic");
		return Ok(response);
	}

	/// <summary>
	/// Incident Report per month given a specific year
	/// </summary>
	/// <returns></returns>
	[HttpGet("count-all-incident-per-year")]
	public async Task<IActionResult> CountIncidentRecordPerYear([FromQuery] int year)
	{
		IncidentRecordCountPerYear result = await _incidentRecordService.CountAllIncidentRecordPerYear(year);
		ApiResponseWrapper<IncidentRecordCountPerYear> response = ApiResponseWrapper<IncidentRecordCountPerYear>
			.Success(result, "Get all incident count per year success");
		return Ok(response);
	}

}
