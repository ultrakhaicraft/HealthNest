using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels.Accounts;

public class AdminDetailModel : AccountDetailModel
{
	public string? Description { get; set; }
}

public class CreateAdminModel : AccountCreateRequest
{
	[Required]
	public string Description { get; set; } = null!;

}

public class UpdateAdminModel : AccountUpdateRequest
{
	[Required]
	public string Description { get; set; } = null!;
}
