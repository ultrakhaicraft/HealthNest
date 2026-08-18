using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;

namespace PRN232_SchoolMedicalAPI.Controllers
{
    [ApiController]
    [Route("api/medical-request")]
    public class MedicineRequestController : ControllerBase
    {
        private readonly IMedicineRequestService _medicineRequestService;

        public MedicineRequestController(IMedicineRequestService medicineRequestService)
        {
            _medicineRequestService = medicineRequestService;
        }

        /// <summary>
        /// Get paginated list of medicine requests with filtering and sorting
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetMedicineRequests([FromQuery] MedicineRequestFilterRequestDto request)
        {
            var result = await _medicineRequestService.GetMedicineRequestsAsync(request);

			ApiResponseWrapper<PagingModel<MedicineRequestResponseDto>> response = ApiResponseWrapper<PagingModel<MedicineRequestResponseDto>>
			.Success(result, "Get all medicine requests success");
			
            return Ok(result);
        }

        /// <summary>
        /// Get medicine request details by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicineRequestById(string id)
        {
            var result = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
           

			ApiResponseWrapper<MedicineRequestResponseDto> response = ApiResponseWrapper<MedicineRequestResponseDto>
			.Success(result, "Get medicine request success with Id: "+id);

			return Ok(response);
        }

        /// <summary>
        /// Get medicine requests by student ID
        /// </summary>
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetMedicineRequestsByStudent(string studentId)
        {
            var result = await _medicineRequestService.GetMedicineRequestsByStudentAsync(studentId);
			ApiResponseWrapper<PagingModel<MedicineRequestResponseDto>> response = ApiResponseWrapper<PagingModel<MedicineRequestResponseDto>>
						.Success(result, "Get all medicine requests success for student with Id: "+studentId);

			return Ok(response);
        }

        /// <summary>
        /// Get medicine requests by requester Id
        /// </summary>
        /// <param name="requesterId">Account Id</param>
        /// <returns></returns>
        [HttpGet("requester/{requesterId}")]
        public async Task<IActionResult> GetMedicineRequestsByRequester(string requesterId)
        {
            var result = await _medicineRequestService.GetMedicineRequestsByRequesterAsync(requesterId);
			ApiResponseWrapper<PagingModel<MedicineRequestResponseDto>> response = ApiResponseWrapper<PagingModel<MedicineRequestResponseDto>>
						.Success(result, "Get all medicine requests success for requester with Id: " + requesterId);

			return Ok(response);
        }

        /// <summary>
        /// Create new medicine request
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateMedicineRequest([FromBody] CreateMedicineRequestRequestDto request)
        {
            // Validation is handled by ResultManipulator middleware
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

            var result = await _medicineRequestService.CreateMedicineRequestAsync(request);

			ApiResponseWrapper<MedicineRequestResponseDto> response = ApiResponseWrapper<MedicineRequestResponseDto>
						.Created(result, "Create medicine request Success");

			return StatusCode(201, response);
		}

        /// <summary>
        /// Update existing medicine request
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicineRequest(string id, [FromBody] UpdateMedicineRequestRequestDto request)
        {
            

            // Validation is handled by ResultManipulator middleware
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

            var result = await _medicineRequestService.UpdateMedicineRequestAsync(request,id);

			ApiResponseWrapper<MedicineRequestResponseDto> response = ApiResponseWrapper<MedicineRequestResponseDto>
						.Success(result, "Update medicine requests success with Id: " + id);

			return Ok(response);
        }

        /// <summary>
        /// Delete medicine request
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicineRequest(string id)
        {
            await _medicineRequestService.DeleteMedicineRequestAsync(id);

			ApiResponseWrapper<string> response = ApiResponseWrapper<string>
			.NoContent("Delete Medicine Request success with Id "+id);

            return StatusCode(204, response);
        }
    }
}
