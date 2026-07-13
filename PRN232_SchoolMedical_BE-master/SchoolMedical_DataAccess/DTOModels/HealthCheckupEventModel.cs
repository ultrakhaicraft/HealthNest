using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels
{
	public class ViewHealthCheckupEventDTO
	{
	}

	public class HealthCheckupEventDetailDTO
	{

		public string Id { get; set; } = null!;

		public string? StudentId { get; set; }

		public string CreatedBy { get; set; } = null!;

		public string Title { get; set; } = null!;

		public string? ShortDescription { get; set; }

		public string? Content { get; set; }

		public DateTime DateOccurred { get; set; }

		public DateTime? DateSignupStart { get; set; }

		public DateTime? DateSignupEnd { get; set; }

		public string? Status { get; set; }

	}

}
