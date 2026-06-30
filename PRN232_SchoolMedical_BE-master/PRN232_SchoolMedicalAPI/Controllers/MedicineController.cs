using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        HttpContext.Items["CustomMessage"] = "Retrieving All Medicines Successful";
        return Ok(result);
    }

    /// <summary>
    /// Get medicine details by ID
    /// </summary>
    [HttpGet("{id}")]
    //[Authorize(Roles = "SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> GetMedicineById(string id)
    {
        var medicine = await _medicineService.GetMedicineDetailByIdAsync(id);
        if (medicine == null)
        {
            throw new KeyNotFoundException("Medicine not found");
        }
        HttpContext.Items["CustomMessage"] = "Medicine Found";
        return Ok(medicine);
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
        var medicine = await _medicineService.CreateMedicineAsync(request, currentUserId);

        HttpContext.Items["CustomMessage"] = "Medicine created successfully";
        return CreatedAtAction(nameof(GetMedicineById), new { id = medicine.Id }, medicine);
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

        var currentUserId = User.Claims.GetUserIdFromJwtToken();
        var medicine = await _medicineService.UpdateMedicineAsync(request, id);
        HttpContext.Items["CustomMessage"] = "Medicine updated successfully";
        return Ok(medicine);
    }

    /// <summary>
    /// Soft delete medicine
    /// </summary>
    [HttpDelete("{id}")]
    //[Authorize(Roles ="SchoolNurse, Admin, Manager")]
    public async Task<IActionResult> DeleteMedicine(string id)
    {
        var result = await _medicineService.SoftDeleteMedicineAsync(id);   
        HttpContext.Items["CustomMessage"] = "Medicine deleted successfully";
        return Ok(result);
    }
}
