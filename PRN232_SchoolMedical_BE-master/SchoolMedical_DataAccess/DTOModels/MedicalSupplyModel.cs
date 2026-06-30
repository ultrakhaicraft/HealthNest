using SchoolMedical_DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels;

public class MedicalSupplyCreateModel
{
    public string? CreatedBy { get; set; }

    public string? Name { get; set; } 

    public string? Description { get; set; }

    public int Amount { get; set; }

}

public class MedicalSupplyUpdateModel
{

	public string? CreatedBy { get; set; }

	public string? Name { get; set; }

	public string? Description { get; set; }

	public int Amount { get; set; }

	public bool? IsAvailable { get; set; }

	public bool IsDeleted { get; set; }

}

public class MedicalSupplyViewModel
{
	public string? Id { get; set; }
	public string? Name { get; set; }
	public int Amount { get; set; }
	public bool? IsAvailable { get; set; }
	public bool IsDeleted { get; set; }

}

public class MedicalSupplyDetailModel
{
	public string? Id { get; set; }

	public string? CreatedBy { get; set; }

	public string? Name { get; set; }

	public string? Description { get; set; }

	public int Amount { get; set; }

	public bool? IsAvailable { get; set; }

	public bool IsDeleted { get; set; }

}

public class MedicalSupplyQuery
{
	public int PageIndex { get; set; } = 1; // Default to first page
	public int PageSize { get; set; } = 10; // Default to 10 items per page
}