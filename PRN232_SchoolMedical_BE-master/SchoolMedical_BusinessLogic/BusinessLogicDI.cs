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
		services.AddAutoMapper();
		services.AddServices(configuration);
	}

	public static void AddRepository(this IServiceCollection services)
	{
		services
			.AddScoped<IUnitOfWork, UnitOfWork>();
		services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

	}

	private static void AddAutoMapper(this IServiceCollection services)
	{
		services.AddAutoMapper(typeof(MapperProfile));
	}

	public static void AddServices(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddLogging();
		services.AddScoped<IAuthService, AuthService>();
		services.AddScoped<IJwtUtils, JwtUtils>();
		services.AddScoped<IAccountService, AccountService>();
		services.AddScoped<IMedicineService, MedicineService>();
		services.AddScoped<IMedicineRequestService, MedicineRequestService>();
        services.AddScoped<IIncidentRecordService, IncidentRecordService>();
		services.AddScoped<IStudentHealthRecordService, StudentHealthRecordService>();
    }
}
