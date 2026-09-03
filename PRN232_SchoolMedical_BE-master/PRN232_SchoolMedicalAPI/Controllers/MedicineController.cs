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
[Route("api/medicine")]
//[Authorize]
public class MedicineController : ControllerBase
{
    private readonly IMedicineService _medicineService;

    public MedicineController(IMedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    /// <summary>
    /// Get paginated list of medicines with filtering and sorting
    /// </summary>
    [HttpGet]
    //[Authorize(Roles ="SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> GetMedicines([FromQuery] MedicineFilterRequestDto request)
    {
        var result = await _medicineService.GetAllMedicinesAsync(request);
		ApiResponseWrapper<PagingModel<MedicineDetailResponseDto>> response = ApiResponseWrapper<PagingModel<MedicineDetailResponseDto>>
						.Success(result, "Get all medicines success");
		return Ok(response);
    }

    /// <summary>
    /// Get medicine details by ID
    /// </summary>
    [HttpGet("{id}")]
    //[Authorize(Roles = "SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> GetMedicineById(string id)
    {
        var result = await _medicineService.GetMedicineDetailByIdAsync(id);

		ApiResponseWrapper<MedicineDetailResponseDto> response = ApiResponseWrapper<MedicineDetailResponseDto>
						.Success(result, "Get medicine success with Id: "+id);

		return Ok(response);
    }

    /// <summary>
    /// Create new medicine
    /// </summary>
    [HttpPost]
    //[Authorize(Roles ="SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> CreateMedicine([FromBody] CreateMedicineRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var currentUserId = User.Claims.GetUserIdFromJwtToken();
        var result = await _medicineService.CreateMedicineAsync(request, currentUserId);

		ApiResponseWrapper<MedicineDetailResponseDto> response = ApiResponseWrapper<MedicineDetailResponseDto>
						.Created(result, "Create Medicine successful");

		return StatusCode(201,response);
    }

    /// <summary>
    /// Update existing medicine
    /// </summary>
    [HttpPut("{id}")]
    //[Authorize(Roles ="SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> UpdateMedicine(string id, [FromBody] UpdateMedicineRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _medicineService.UpdateMedicineAsync(request, id);

		ApiResponseWrapper<MedicineDetailResponseDto> response = ApiResponseWrapper<MedicineDetailResponseDto>
						.Success(result, "Update Medicine successful with Id: "+id);

		return Ok(response);
    }

    /// <summary>
    /// Soft delete medicine
    /// </summary>
    [HttpDelete("{id}")]
    //[Authorize(Roles ="SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> DeleteMedicine(string id)
    {
        await _medicineService.SoftDeleteMedicineAsync(id);
		ApiResponseWrapper<string> response = ApiResponseWrapper<string>
						.NoContent("Delete Medicine successful with Id: " + id);
		
        return Ok(response);
    }
}
