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
		Task<string> CreateHealthCheckupAsync(HealthCheckupEventCreateDTO dto);
		Task DeleteHealthCheckupEvent(string healthCheckupEventId);
		Task<string> UpdateHealthCheckupEvent(HealthCheckupEventUpdateDTO dto, string healthCheckupId);
		Task<HealthCheckupEventDetailDTO> GetHealthCheckupEventById(string healthCheckupEventId);



	}
}
