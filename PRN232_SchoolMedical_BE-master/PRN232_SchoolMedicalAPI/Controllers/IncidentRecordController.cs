using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PRN232_SchoolMedicalAPI.Helpers;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using System.Security.Claims;

namespace PRN232_SchoolMedicalAPI.Controllers;

[ApiController]
[Route("api/incident-record")]
//[Authorize]
public class IncidentRecordController : ControllerBase
{
    private readonly IIncidentRecordService _incidentRecordService;

    public IncidentRecordController(IIncidentRecordService incidentRecordService)
    {
        _incidentRecordService = incidentRecordService;
    }

    /// <summary>
    /// Get all incident records
    /// </summary>
    [HttpGet]
    //[Authorize(Roles = "SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> GetIncidentRecords()
    {
        var result = await _incidentRecordService.GetAllIncidentRecordsAsync();
        HttpContext.Items["CustomMessage"] = "Retrieving All Incident Records Successful";
        return Ok(result);
    }

    /// <summary>
    /// Get incident record details by ID
    /// </summary>
    [HttpGet("{id}")]
    //[Authorize(Roles = "SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> GetIncidentRecordById(string id)
    {
        var incident = await _incidentRecordService.GetIncidentRecordDetailByIdAsync(id);
        if (incident == null)
        {
            throw new KeyNotFoundException("Incident record not found");
        }
        HttpContext.Items["CustomMessage"] = "Incident Record Found";
        return Ok(incident);
    }

    /// <summary>
    /// Create new incident record
    /// </summary>
    [HttpPost]
    //[Authorize(Roles = "SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> CreateIncidentRecord([FromBody] IncidentRecordCreateRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var currentUserId = User.Claims.GetUserIdFromJwtToken();
        var incident = await _incidentRecordService.CreateIncidentRecordAsync(request, currentUserId);

        HttpContext.Items["CustomMessage"] = "Incident record created successfully";
        return CreatedAtAction(nameof(GetIncidentRecordById), new { id = incident.Id }, incident);
    }

    /// <summary>
    /// Update existing incident record
    /// </summary>
    [HttpPut("{id}")]
    //[Authorize(Roles = "SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> UpdateIncidentRecord(string id, [FromBody] IncidentRecordUpdateRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var incident = await _incidentRecordService.UpdateIncidentRecordAsync(request, id);
        if (incident == null)
        {
            throw new KeyNotFoundException("Incident record not found");
        }

        HttpContext.Items["CustomMessage"] = "Incident record updated successfully";
        return Ok(incident);
    }

	/// <summary>
	/// Update existing incident record
	/// </summary>
	[HttpPatch("change-status/{id}")]
	//[Authorize(Roles = "SchoolNurse, Admin, Manager")]
	public async Task<IActionResult> UpdateRecordStatus(string id, [FromQuery] string status)
	{
		

		var result = await _incidentRecordService.ChangeStatusRecord(id, status);
		if (result)
		{
			throw new AppException("Failed to change record status");
		}

		HttpContext.Items["CustomMessage"] = "Incident record updated status successfully";
		return Ok(result);
	}

	/// <summary>
	/// Soft delete incident record
	/// </summary>
	[HttpDelete("{id}")]
    //[Authorize(Roles = "SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> DeleteIncidentRecord(string id)
    {
        var result = await _incidentRecordService.SoftDeleteIncidentRecordAsync(id);
        if (!result)
        {
            throw new KeyNotFoundException("Incident record not found");
        }

        HttpContext.Items["CustomMessage"] = "Incident record deleted successfully";
        return Ok(result);
    }
} 