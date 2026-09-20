using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels.Accounts;

public class StudentDetailModel : AccountDetailModel
{
	public string? ParentId { get; set; } // Point to Parent.Id
	public string? Class { get; set; } //Include Grade and Class Number
	public string? CurrentHealthStatus { get; set; } //Use Enum CurrentHealthStatus for health monitoring
}



public class CreateStudentModel : AccountCreateRequest
{
	public string? ParentId { get; set; } // Doesn't necessarily need when created
	[Required]
	public string Class { get; set; } = null!; //Include Grade and Class Number
	[Required]
	public string CurrentHealthStatus { get; set; } = null!; //Use Enum CurrentHealthStatus for health monitoring
	
}

public class UpdateStudentModel : AccountUpdateRequest
{
	[Required]
	public string ParentId { get; set; } = null!; // Point to Parent.Id
	[Required]
	public string Class { get; set; } = null!; //Include Grade and Class Number
	[Required]
	public string CurrentHealthStatus { get; set; } = null!; //Use Enum CurrentHealthStatus for health monitoring
}

public class StudentViewModel : AccountViewModel
{
	public string Class { get; set; } = null!; //Include Grade and Class Number
	public string CurrentHealthStatus { get; set; } = null!; //Use Enum CurrentHealthStatus for health monitoring
}
