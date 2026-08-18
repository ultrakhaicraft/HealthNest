using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Enums;

namespace PRN232_SchoolMedicalAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicalsupplyController : ControllerBase
{
    private readonly IMedicalSupplyService medicalSupplyService;

    public MedicalsupplyController(IMedicalSupplyService medicalSupplyService)
    {
        this.medicalSupplyService = medicalSupplyService;
    }

    // GET: api/medicalsupply
    [HttpGet]
    //[Authorize(Roles = "SchoolNurse,Admin")]
	public async Task<IActionResult> GetAll([FromQuery] MedicalSupplyQuery query)
	{
		var result = await medicalSupplyService.GetAllMedicalSupplyAsync(query);
		ApiResponseWrapper<PagingModel<MedicalSupplyViewModel>> response = ApiResponseWrapper<PagingModel<MedicalSupplyViewModel>>
					.Success(result, "Get all medicine suppplies success");

		return Ok(response);
	}

	// GET: api/medicalsupply/{id}
	[HttpGet("{id}")]
	public async Task<IActionResult> GetById(string id)
	{
		var result = await medicalSupplyService.GetMedicalSupplyByIdAsync(id);
		ApiResponseWrapper<MedicalSupplyDetailModel> response = ApiResponseWrapper<MedicalSupplyDetailModel>
					 .Success(result, "Get all medicine suppplies success with Id: " + id);

		return Ok(result);
	}

	// POST: api/medicalsupply
	[HttpPost]
	public async Task<IActionResult> Create([FromBody] MedicalSupplyCreateModel request)
	{

		var createdBy = "admin";
		var result = await medicalSupplyService.CreateMedicalSupplyAsync(request, createdBy);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					 .Created(result, "Create Medical Supply success");
		return StatusCode(201,response);
	}

	// PUT: api/medicalsupply/{id}
	[HttpPut("{id}")]
	public async Task<IActionResult> Update(string id, [FromBody] MedicalSupplyUpdateModel request)
	{
		
		await medicalSupplyService.UpdateMedicalSupplyAsync(request, id);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					 .Success(string.Empty, "Update medicine suppplies success with Id: " + id);
		return Ok(response);
		
	}

	// DELETE: api/medicalsupply/{id}
	[HttpDelete("{id}")]
	public async Task<IActionResult> SoftDelete(string id)
	{
		await medicalSupplyService.SoftDeleteMedicalSupplyAsync(id);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
					 .NoContent("Update medicine suppplies success with Id: " + id);

		return StatusCode(204, response);
	}
}

