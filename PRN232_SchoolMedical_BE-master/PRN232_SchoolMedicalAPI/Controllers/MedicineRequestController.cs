using Microsoft.AspNetCore.Mvc;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.DTOModels;

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
            return Ok(result);
        }

        /// <summary>
        /// Get medicine request details by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMedicineRequestById(string id)
        {
            var medicineRequest = await _medicineRequestService.GetMedicineRequestByIdAsync(id);
            if (medicineRequest == null)
            {
                throw new KeyNotFoundException("Medicine request not found");
            }

            return Ok(medicineRequest);
        }

        /// <summary>
        /// Get medicine requests by student ID
        /// </summary>
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetMedicineRequestsByStudent(string studentId)
        {
            var requests = await _medicineRequestService.GetMedicineRequestsByStudentAsync(studentId);
            return Ok(requests);
        }

        /// <summary>
        /// Get medicine requests by requester ID
        /// </summary>
        [HttpGet("requester/{requesterId}")]
        public async Task<IActionResult> GetMedicineRequestsByRequester(string requesterId)
        {
            var requests = await _medicineRequestService.GetMedicineRequestsByRequesterAsync(requesterId);
            return Ok(requests);
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
                return BadRequest(ModelState);
            }

            var medicineRequest = await _medicineRequestService.CreateMedicineRequestAsync(request);

            return CreatedAtAction(nameof(GetMedicineRequestById), new { id = medicineRequest.Id }, medicineRequest);
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
                return BadRequest(ModelState);
            }

            var medicineRequest = await _medicineRequestService.UpdateMedicineRequestAsync(request,id);

            return Ok(medicineRequest);
        }

        /// <summary>
        /// Delete medicine request
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicineRequest(string id)
        {
            var result = await _medicineRequestService.DeleteMedicineRequestAsync(id);
            if (!result)
            {
                throw new KeyNotFoundException("Medicine request not found");
            }

            return Ok(new { message = "Medicine request deleted successfully" });
        }
    }
}
