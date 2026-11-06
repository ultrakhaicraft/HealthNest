using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.DTOModels
{
	public record  DashboardStatistic
	{
		public required UserCountStatistic UserCountStatistic { get; set; } 
		public int ActiveIncidentRecord { get; set; } = 0;
		public int PendingMedicineRequest { get; set; } = 0;
		public int UpcomingVaccineEvent { get; set; } = 0;
		public int UpcomingHealthCheckup { get; set; } = 0;

	}

	public record UserCountStatistic
	{
		public int TotalDailyUser { get; set; } = 0;
		public int TotalStudent { get; set; } = 0;
		public int TotalParent { get; set; } = 0;
		public int TotalSchoolNurse { get; set; } = 0;
	}
}
