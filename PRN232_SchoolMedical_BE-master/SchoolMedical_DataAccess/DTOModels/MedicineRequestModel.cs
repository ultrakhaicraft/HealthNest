using SchoolMedical_DataAccess.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels
{
    public class CreateMedicineRequestRequestDto
    {
        [Required(ErrorMessage = "RequestBy is required")]
        public string RequestBy { get; set; } = null!;

        [Required(ErrorMessage = "ForStudent is required")]
        public string ForStudent { get; set; } = null!;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }
    }

    public class UpdateMedicineRequestRequestDto
    {
        [Required(ErrorMessage = "RequestBy is required")]
        public string RequestBy { get; set; } = null!;

        [Required(ErrorMessage = "ForStudent is required")]
        public string ForStudent { get; set; } = null!;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        public RequestStatus? Status { get; set; }
    }

    public class MedicineRequestFilterRequestDto
    {
        public string? RequestBy { get; set; }
        public string? ForStudent { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        public RequestStatus? Status { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Page index must be greater than 0")]
        public int PageIndex { get; set; } = 1;

        [Range(1, 100, ErrorMessage = "Page size must be between 1 and 100")]
        public int PageSize { get; set; } = 10;

        [RegularExpression("^(DateSent|RequestBy|ForStudent)$",
            ErrorMessage = "Sort by must be one of: DateSent, RequestBy, ForStudent")]
        public string? SortBy { get; set; } = "DateSent";

        public bool IsDescending { get; set; } = true;
    }

    public class MedicineRequestResponseDto
    {
        public string Id { get; set; } = null!;
        public string RequestBy { get; set; } = null!;
        public string RequestByName { get; set; } = null!;
        public string ForStudent { get; set; } = null!;
        public string ForStudentName { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime DateSent { get; set; }
        public string? Status { get; set; }
	}
}
