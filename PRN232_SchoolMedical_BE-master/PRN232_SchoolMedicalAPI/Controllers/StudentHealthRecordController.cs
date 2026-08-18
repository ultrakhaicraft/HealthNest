using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using PRN232_SchoolMedicalAPI.Helpers;
using SchoolMedical_BusinessLogic.Core;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;

namespace PRN232_SchoolMedicalAPI.Controllers;

[ApiController]
[Route("api/student-health-record")]
//[Authorize]
public class StudentHealthRecordController : ControllerBase
{
	private readonly IStudentHealthRecordService _studentHealthRecordService;

	public StudentHealthRecordController(IStudentHealthRecordService studentHealthRecordService)
	{
		_studentHealthRecordService = studentHealthRecordService;
	}

	/// <summary>
	/// Get paginated list of student health records with filtering and sorting
	/// </summary>
	[HttpGet]
	public async Task<IActionResult> GetStudentHealthRecords([FromQuery] StudentHealthRecordQuery request)
	{
		var result = await _studentHealthRecordService.GetAllRecords(request);

		ApiResponseWrapper<PagingModel<StudentHealthRecordViewModel>> response = ApiResponseWrapper<PagingModel<StudentHealthRecordViewModel>>
			.Success(result, "Get all student health records successful");

		return Ok(response);
	}

	/// <summary>
	/// Get student health record details by ID
	/// </summary>
	[HttpGet("{id}")]
	public async Task<IActionResult> GetStudentHealthRecordById(string id)
	{
		var result = await _studentHealthRecordService.GetRecordByIdAsync(id);
		
		ApiResponseWrapper<StudentHealthRecordDetailModel> response = ApiResponseWrapper<StudentHealthRecordDetailModel>
			.Success(result, "Get student health records successful with Id: "+id);

		return Ok(response);
	}

	/// <summary>
	/// Get student health record details by ID
	/// </summary>
	[HttpGet("from-student/{studentId}")]
	public async Task<IActionResult> GetStudentHealthRecordFromStudentId(string studentId)
	{
		var result = await _studentHealthRecordService.GetRecordFromStudentIdAsync(studentId);

		ApiResponseWrapper<StudentHealthRecordDetailModel> response = ApiResponseWrapper<StudentHealthRecordDetailModel>
			.Success(result, "Get student health records successful with student Id: "+studentId);

		return Ok(response);
	}

	/// <summary>
	/// Create new student health record
	/// </summary>
	[HttpPost]
	public async Task<IActionResult> CreateStudentHealthRecord([FromBody] StudentHealthRecordCreateModel record)
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

		var result = await _studentHealthRecordService.CreateRecordAsync(record, record.CreatedBy);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Created(result, "Create student health record successful");

		return StatusCode(201,response);
	}

	/// <summary>
	/// Update existing student health record
	/// TODO: do not change createdBy
	/// </summary>
	[HttpPut("{id}")]
	public async Task<IActionResult> UpdateStudentHealthRecord(string id, [FromBody] StudentHealthRecordUpdateModel record)
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

		await _studentHealthRecordService.UpdateRecordAsync(record, id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Success(string.Empty, "Update student health record successful with Id: " + id);

		return Ok(response);
	}

	[HttpPut("{id}/status")]
	public async Task<IActionResult> UpdateStudentHealthRecordStatus(string id, [FromQuery] String status)
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

		await _studentHealthRecordService.UpdateRecordStatusAsync(id, status);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.Success(string.Empty, "Update student health record status successful with Id: " + id);

		return Ok(response);
	}

	/// <summary>
	/// Delete student health record
	/// </summary>
	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteStudentHealthRecord(string id)
	{
		await _studentHealthRecordService.DeleteRecordAsync(id);

		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					.NoContent("Delete student health records successful with student Id: " + id); 

		return StatusCode(204,response);
	}
}
