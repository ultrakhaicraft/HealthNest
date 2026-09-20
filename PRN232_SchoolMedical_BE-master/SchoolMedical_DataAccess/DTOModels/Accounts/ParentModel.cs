using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels.Accounts
{
	public class ParentDetailModel : AccountDetailModel
	{
		public string? RelationshipStatus { get; set; }
		public string? IncomeLevel { get; set; }
	}

	public class CreateParentModel : AccountCreateRequest
	{
		[Required]
		public string RelationshipStatus { get; set; } = null!;
		[Required]
		public string IncomeLevel { get; set; } = null!;
	}

	public class UpdateParentModel : AccountUpdateRequest
	{
		[Required]
		public string RelationshipStatus { get; set; } = null!;
		[Required]
		public string IncomeLevel { get; set; } = null!;
	}
}
