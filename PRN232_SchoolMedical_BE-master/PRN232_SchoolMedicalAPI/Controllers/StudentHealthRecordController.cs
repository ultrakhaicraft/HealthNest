using Microsoft.AspNetCore.Mvc;
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
		var records = await _studentHealthRecordService.GetAllRecords(request);
		HttpContext.Items["CustomMessage"] = "Get all records successfully";
		return Ok(records);
	}

	/// <summary>
	/// Get student health record details by ID
	/// </summary>
	[HttpGet("{id}")]
	public async Task<IActionResult> GetStudentHealthRecordById(string id)
	{
		var record = await _studentHealthRecordService.GetRecordByIdAsync(id);
		if (record == null)
		{
			throw new KeyNotFoundException("Student health record not foundby this ID");
		}
		HttpContext.Items["CustomMessage"] = "Displaying the record details";
		return Ok(record);
	}

	/// <summary>
	/// Get student health record details by ID
	/// </summary>
	[HttpGet("from-student/{studentId}")]
	public async Task<IActionResult> GetStudentHealthRecordFromStudentId(string studentId)
	{
		var record = await _studentHealthRecordService.GetRecordFromStudentIdAsync(studentId);
		if (record == null)
		{
			throw new KeyNotFoundException("Student health record not foundby this ID");
		}
		HttpContext.Items["CustomMessage"] = "Displaying the record details";
		return Ok(record);
	}

	/// <summary>
	/// Create new student health record
	/// </summary>
	[HttpPost]
	public async Task<IActionResult> CreateStudentHealthRecord([FromBody] StudentHealthRecordCreateModel record)
	{
		if (!ModelState.IsValid)
		{
			return BadRequest(ModelState);
		}

		//var createdBy = User.Claims.GetUserIdFromJwtToken() ?? "Unknown";
		var recordId = await _studentHealthRecordService.CreateRecordAsync(record, record.CreatedBy);
		HttpContext.Items["CustomMessage"] = "Record created successfully";
		return CreatedAtAction(nameof(GetStudentHealthRecordById), new { id = recordId }, recordId);
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
			return BadRequest(ModelState);
		}

		
		await _studentHealthRecordService.UpdateRecordAsync(record, id);
		HttpContext.Items["CustomMessage"] = "Record updated successfully";
		return Ok();
	}

	/// <summary>
	/// Delete student health record
	/// </summary>
	[HttpDelete("{id}")]
	public async Task<IActionResult> DeleteStudentHealthRecord(string id)
	{
		await _studentHealthRecordService.DeleteRecordAsync(id);
		HttpContext.Items["CustomMessage"] = "Record deleted successfully";
		return Ok();
	}
}
