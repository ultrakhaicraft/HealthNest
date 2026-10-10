using HealthNest_BusinessLogic.Core;
using HealthNest_BusinessLogic.Interface;
using HealthNest_BusinessLogic.Utility;
using HealthNest_DAO.Interfaces;
using HealthNest_DAO.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic;

public static class BusinessLogicDI
{
	public static void AddApplication(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddRepository();
		//services.AddAutoMapper(cfg => cfg.AddMaps(typeof(MapperProfile).Assembly)); 
		services.AddServices(configuration);
		services.AddFactories();
	}

	public static void AddRepository(this IServiceCollection services)
	{
		services
			.AddScoped<IUnitOfWork, UnitOfWork>();
		services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

	}

	public static void AddFactories(this IServiceCollection services)
	{
		services.AddScoped<IAccountModelFactory, StudentModelFactory>();
		services.AddScoped<IAccountModelFactory, ParentModelFactory>();
		services.AddScoped<IAccountModelFactory, NurseModelFactory>();
		services.AddScoped<IAccountModelFactory, AdminModelFactory>();
	}

	public static void AddServices(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddLogging();
		services.AddScoped<ITokenUtils, TokenUtils>();
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
