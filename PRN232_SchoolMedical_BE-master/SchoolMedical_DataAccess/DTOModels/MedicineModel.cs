using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels
{
    public class CreateMedicineRequestDto
    {
        [Required(ErrorMessage = "Medicine name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Medicine name must be between 2 and 100 characters")]
        public string Name { get; set; } = null!;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Amount must be a positive number")]
        public int Amount { get; set; }

        public bool? IsAvailable { get; set; }
    }

    //No ID because API Query already have Id
    public class UpdateMedicineRequestDto
    {   

        [Required(ErrorMessage = "Medicine name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Medicine name must be between 2 and 100 characters")]
        public string Name { get; set; } = null!;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Amount must be a positive number")]
        public int Amount { get; set; }

        public bool? IsAvailable { get; set; }
    }

    public class MedicineFilterRequestDto
    {
        [StringLength(100, ErrorMessage = "Name filter cannot exceed 100 characters")]
        public string? Name { get; set; }

        public bool? IsAvailable { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Page index must be greater than 0")]
        public int PageIndex { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
        public int PageSize { get; set; } = 10;

        [RegularExpression("^(Name|Amount|IsAvailable|CreatedBy)$",
            ErrorMessage = "Sort by must be one of: Name, Amount, IsAvailable, CreatedBy")]
        public string? SortBy { get; set; } = "Name";

        public bool IsDescending { get; set; } = false;
    }

    public class MedicineDetailResponseDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Amount { get; set; }
        public bool? IsAvailable { get; set; }
        public string CreatedBy { get; set; } = null!;
        public string CreatedByName { get; set; } = null!;
    }
}
