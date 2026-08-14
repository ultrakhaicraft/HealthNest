using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SchoolMedical_BusinessLogic.Core;
using SchoolMedical_BusinessLogic.Interface;
using SchoolMedical_BusinessLogic.Mapper;
using SchoolMedical_BusinessLogic.Utility;
using SchoolMedical_DataAccess.Interfaces;
using SchoolMedical_DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic;

public static class BusinessLogicDI
{
	public static void AddApplication(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddRepository();
		services.AddAutoMapper(cfg => cfg.AddMaps(typeof(MapperProfile).Assembly)); 
		services.AddServices(configuration);
	}

	public static void AddRepository(this IServiceCollection services)
	{
		services
			.AddScoped<IUnitOfWork, UnitOfWork>();
		services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

	}

	

	public static void AddServices(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddLogging();
		services.AddScoped<IJwtUtils, JwtUtils>();
		services.AddScoped<IAccountService, AccountService>();
		services.AddScoped<IAuthService, AuthService>();
		services.AddScoped<IHealthCheckupEventService, HealthCheckupEventService>();
		services.AddScoped<IIncidentRecordService, IncidentRecordService>();
		services.AddScoped<IMedicalSupplyService, MedicalSupplyService>();
		services.AddScoped<IMedicineRequestService, MedicineRequestService>();
		services.AddScoped<IMedicineService, MedicineService>();
		services.AddScoped<IStudentHealthRecordService, StudentHealthRecordService>();
		services.AddScoped<IVaccineEventService, VaccineEventService>();
    }
}
