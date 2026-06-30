using Microsoft.EntityFrameworkCore;
using SchoolMedical_BusinessLogic;
using SchoolMedical_DataAccess.DTOModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SchoolMedical_DataAccess.Entities;
using System.Text;
using Google.Protobuf.WellKnownTypes;
using Microsoft.OpenApi.Models;

namespace PRN232_SchoolMedicalAPI;

public static class AppExtension
{
	public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
	{
		services.ConfigSwagger();
		services.ConfigureJWTToken(configuration.GetSection("JwtSettings").Get<JwtModel>());
		services.AddDatabase(new DBConnection
		{
			ConnectionString = configuration.GetConnectionString("DefaultConnection")
		});
		services.AddApplication(configuration);
		services.ConfigCors();
		//services.ConfigRoute();
	}
	public static void ConfigCors(this IServiceCollection services)
	{
		services.AddCors(options => options.AddPolicy("AllowAllOrigins", builder =>
				builder.AllowAnyHeader()
					   .AllowAnyMethod()
					   .AllowAnyOrigin())
		);
	}

	public static void ConfigSwagger(this IServiceCollection services)
	{
		services.AddEndpointsApiExplorer();
		services.AddSwaggerGen(c =>
		{
			c.SwaggerDoc("v1", new OpenApiInfo
			{
				Version = "v1",
				Title = "School Medical API",
				Description = "API for School Medical System"
			});
			c.CustomSchemaIds(type => type.FullName);
			c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
					{
						In = ParameterLocation.Header,
						Description = "Please enter a valid token",
						Name = "Authorization",
						Type = SecuritySchemeType.Http,
						BearerFormat = "JWT",
						Scheme = "Bearer"
					});
			c.AddSecurityRequirement(new OpenApiSecurityRequirement
					{
						{
							new OpenApiSecurityScheme
							{
								Reference = new OpenApiReference
								{
									Type = ReferenceType.SecurityScheme,
									Id = "Bearer"
								}
							},
							new string[]{}
						}
					});
			c.UseInlineDefinitionsForEnums(); 
		});

	}

	public static void AddDatabase(this IServiceCollection services,DBConnection connection)
	{
		if (string.IsNullOrEmpty(connection?.ConnectionString))
		{
			throw new InvalidOperationException("Database connection string is not configured properly.");
		}

		services.AddDbContext<SchoolhealthdbContext>(options =>
		{
			options.UseMySQL(connection.ConnectionString);
		});
	}

	public static void ConfigureJWTToken(this IServiceCollection services, JwtModel? jwtModel)
	{
		if (jwtModel == null)
		{
			throw new InvalidOperationException("JWT settings are not configured properly.");
		}
		services
			.AddAuthentication(op =>
			{
				op.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				op.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
				op.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
			})
			.AddJwtBearer(options =>
			{
				options.SaveToken = true;
				options.RequireHttpsMetadata = false;
				options.TokenValidationParameters = new TokenValidationParameters()
				{
					ValidateIssuer = true,
					ValidateAudience = true,
					ValidAudience = jwtModel?.ValidAudience,
					ValidIssuer = jwtModel?.ValidIssuer,
					IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtModel?.SecretKey ?? ""))
				};
			});
			
	}

}
