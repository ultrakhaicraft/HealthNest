using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels
{
	public class ViewHealthCheckupEventDTO
	{
		public string Id { get; set; } = null!;
		public string Title { get; set; } = null!;
		public DateTime DateOccurred { get; set; }
		public DateTime? DateSignupStart { get; set; }
		public DateTime? DateSignupEnd { get; set; }
		public string? Status { get; set; }

	}

	public class HealthCheckupEventDetailDTO
	{

		public string Id { get; set; } = null!;
		public string CreatedBy { get; set; } = null!;
		public string Title { get; set; } = null!;
		public string? ShortDescription { get; set; }
		public string? Content { get; set; }
		public DateTime DateOccurred { get; set; }
		public DateTime? DateSignupStart { get; set; }
		public DateTime? DateSignupEnd { get; set; }
		public string? Status { get; set; }

	}

	public class HealthCheckupEventCreateDTO
	{
		public string CreatedBy { get; set; } = null!;
		public string Title { get; set; } = null!;
		public string? ShortDescription { get; set; }
		public string? Content { get; set; }
		public DateTime DateOccurred { get; set; }
		public DateTime? DateSignupStart { get; set; }
		public DateTime? DateSignupEnd { get; set; }
		public string? Status { get; set; }
	}

	public class HealthCheckupEventUpdateDTO : HealthCheckupEventCreateDTO
	{

	}

	public class HealthCheckupEventQuery
	{
		public int PageIndex { get; set; } = 1; // Default to first page
		public int PageSize { get; set; } = 10; // Default to 10 items per page
		public bool SortByLatestDateOccurred { get; set; } = true; // Default to sort by latest date occurred
		public string? Status { get; set; } // Optional filter by status
	}

}
