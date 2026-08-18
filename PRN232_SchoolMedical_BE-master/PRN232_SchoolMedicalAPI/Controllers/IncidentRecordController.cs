using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
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
	//[Authorize(Roles = "SchoolNurse")]
	public async Task<IActionResult> GetIncidentRecords([FromQuery] IncidentRecordQuery filter)
    {
		var result = await _incidentRecordService.GetAllIncidentRecordsAsync(filter);

		ApiResponseWrapper<PagingModel<IncidentRecordViewModel>> response = ApiResponseWrapper<PagingModel<IncidentRecordViewModel>>
					.Success(result, "Retrieving All Incident Records Successful");

		return Ok(result);
    }

    /// <summary>
    /// Get incident record details by ID
    /// </summary>
    [HttpGet("{id}")]
	//[Authorize(Roles = "SchoolNurse")]
	public async Task<IActionResult> GetIncidentRecordById(string id)
    {
        var result = await _incidentRecordService.GetIncidentRecordDetailByIdAsync(id);
		ApiResponseWrapper<IncidentRecordDetailModel> response = ApiResponseWrapper<IncidentRecordDetailModel>
					.Success(result, "Incident Record Found");

		return Ok(response);
    }

    /// <summary>
    /// Create new incident record
    /// </summary>
    [HttpPost]
    //[Authorize(Roles = "SchoolNurse")]
    public async Task<IActionResult> CreateIncidentRecord([FromBody] IncidentRecordCreateRequest request)
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

        var currentUserId = User.Claims.GetUserIdFromJwtToken();
        var result = await _incidentRecordService.CreateIncidentRecordAsync(request, currentUserId);

        ApiResponseWrapper<IncidentRecordDetailModel> response = ApiResponseWrapper<IncidentRecordDetailModel>
                    .Created(result, "Incident record created successfully");

        return StatusCode(201, response);
    }

    /// <summary>
    /// Update existing incident record
    /// </summary>
    [HttpPut("{id}")]
	//[Authorize(Roles = "SchoolNurse")]
	public async Task<IActionResult> UpdateIncidentRecord(string id, [FromBody] IncidentRecordUpdateRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _incidentRecordService.UpdateIncidentRecordAsync(request, id);
       


		ApiResponseWrapper<IncidentRecordDetailModel> response = ApiResponseWrapper<IncidentRecordDetailModel>
					.Success(result, "Incident record updated successfully");

		return Ok(response);
    }

	/// <summary>
	/// Update existing incident record
	/// </summary>
	[HttpPatch("change-status/{id}")]
	//[Authorize(Roles = "SchoolNurse")]
	public async Task<IActionResult> UpdateRecordStatus(string id, [FromQuery] string status)
	{
		

		await _incidentRecordService.ChangeStatusRecord(id, status);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.Success(string.Empty, "Incident record updated status successfully");

		return Ok(response);
	}

	/// <summary>
	/// Soft delete incident record
	/// </summary>
	[HttpDelete("{id}")]
	//[Authorize(Roles = "SchoolNurse")]
	public async Task<IActionResult> DeleteIncidentRecord(string id)
    {
        await _incidentRecordService.SoftDeleteIncidentRecordAsync(id);
       
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.NoContent("Incident record deleted successfully");

		return StatusCode(204, response);
    }
} 