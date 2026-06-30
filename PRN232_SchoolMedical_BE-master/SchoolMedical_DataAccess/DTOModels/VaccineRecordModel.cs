	using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels
{
	public class VaccineRecordViewModel
	{
		public string Id { get; set; } = null!;

		public string StudentId { get; set; } = null!;
		public string StudentName { get; set; } = null!;

		public DateTime RecordDate { get; set; }

		public string? Vaccine { get; set; }

		public string? Status { get; set; }

	}

	public class VaccineRecordDetailModel
	{
		public string Id { get; set; } = null!;

		public string StudentId { get; set; } = null!;

		public string StudentName { get; set; } = null!;

		public string StudentHealthRecordId { get; set; } = null!;

		public DateTime RecordDate { get; set; }

		public string? Vaccine { get; set; }

		public string? Description { get; set; }

		public string? Status { get; set; }
	}
}
