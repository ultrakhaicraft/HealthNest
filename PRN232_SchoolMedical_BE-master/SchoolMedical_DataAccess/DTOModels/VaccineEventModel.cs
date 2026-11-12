using HealthNest_DAO.Utilities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.DTOModels
{
	public class ViewVaccineEventDTO
	{
		public string Id { get; set; } = null!;
		public string Title { get; set; } = null!;
		public DateTime DateOccurred { get; set; }
		public DateTime? DateSignupStart { get; set; }
		public DateTime? DateSignupEnd { get; set; }
		public string? Status { get; set; }
	}

	public class ViewVaccineEventDetailDTO
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

	public class VaccineEventCreateDTO
	{
		private static readonly TimeSpan MinGap = TimeSpan.FromDays(3);

		[Required]
		public string Title { get; set; } = null!;
		[Required]
		public string? ShortDescription { get; set; }
		[Required]
		public string? Content { get; set; }

		public DateTime DateOccurred { get; set; }
		public DateTime DateSignupStart { get; set; }
		public DateTime DateSignupEnd { get; set; }

		public IEnumerable<ValidationResult> Validate(ValidationContext context)
		{
			if (DateSignupStart != DateSignupEnd)
			{
				yield return new ValidationResult(
					"Signup start and signup end must be provided together.",
					new[] { nameof(DateSignupStart), nameof(DateSignupEnd) });
				yield break;
			}

			if (DateSignupStart is DateTime start && DateSignupEnd is DateTime end)
			{
				if (end < start + MinGap)
					yield return new ValidationResult(
						$"Date Signup End must be at least {MinGap.Days} days after Date Signup Start.",
						new[] { nameof(DateSignupEnd) });

				if (DateOccurred < end + MinGap)
					yield return new ValidationResult(
						$"Date Occurred must be at least {MinGap.Days} days after Date Signup End.",
						new[] { nameof(DateOccurred) });
			}
		}
	}

	public class VaccineEventUpdateDTO : VaccineEventCreateDTO
	{
		public string? Status { get; set; }

	}

	public class VaccineEventQuery
	{
		public int PageIndex { get; set; } = 1; // Default to first page
		public int PageSize { get; set; } = 10; // Default to 10 items per page
		public bool SortByLatestDateOccurred { get; set; } = true; // Default to sort by latest date occurred
		public string? Status { get; set; } // Optional filter by status
	}
}
