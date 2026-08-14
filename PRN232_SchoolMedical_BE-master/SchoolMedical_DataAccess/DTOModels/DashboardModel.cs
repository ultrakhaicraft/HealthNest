using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels
{
	public record  DashboardStatistic
	{
		public int ActiveIncidentRecord { get; set; } = 0;
		public int PendingMedicineRequest { get; set; } = 0;
		public int UpcomingVaccineEvent { get; set; } = 0;
		public int UpcomingHealthCheckup { get; set; } = 0;

	}
}
