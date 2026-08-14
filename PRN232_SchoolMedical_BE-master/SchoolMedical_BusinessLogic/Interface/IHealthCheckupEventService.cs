using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_DataAccess.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Interface
{
	public interface  IHealthCheckupEventService
	{
		Task<PagingModel<ViewHealthCheckupEventDTO>> GetAllHealthCheckupEvent(HealthCheckupEventQuery request);

		Task<int> CountUpcomingHealthCheckup();


	}
}
