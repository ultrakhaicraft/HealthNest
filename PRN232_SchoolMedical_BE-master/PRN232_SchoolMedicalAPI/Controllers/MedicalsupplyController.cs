using Microsoft.AspNetCore.Mvc;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_DataAccess.DTOModels;

namespace PRN232_SchoolMedicalAPI.Controllers
{
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
        public async Task<IActionResult> GetAll([FromQuery] MedicalSupplyQuery filter)
        {
            var result = await medicalSupplyService.GetAllMedicalSupplyAsync(filter);
            return Ok(result);
        }

        // GET: api/medicalsupply/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var result = await medicalSupplyService.GetMedicalSupplyByIdAsync(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // POST: api/medicalsupply
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MedicalSupplyCreateModel request)
        {
            
            var createdBy = "admin";
            var result = await medicalSupplyService.CreateMedicalSupplyAsync(request, createdBy);
            return CreatedAtAction(nameof(GetById), new { id = result }, result);
        }

        // PUT: api/medicalsupply/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] MedicalSupplyUpdateModel request)
        {
            try
            {
                var result = await medicalSupplyService.UpdateMedicalSupplyAsync(request, id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // DELETE: api/medicalsupply/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(string id)
        {
            var success = await medicalSupplyService.SoftDeleteMedicalSupplyAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
