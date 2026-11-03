
using HealthNest_API;
using HealthNest_API.Helpers;
using HealthNest_BusinessLogic;
using HealthNest_BusinessLogic.SignalRHubs;
using HealthNest_DAO.DTOModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddApplication(builder.Configuration);

builder.Services.AddControllers(op =>
{
	
})
.AddJsonOptions(opt =>
{
	opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
})
.ConfigureApiBehaviorOptions(options =>
{
	options.InvalidModelStateResponseFactory = context =>
	{
		var errors = context.ModelState
			.Where(kvp => kvp.Value?.Errors.Count > 0)
			.ToDictionary(
				kvp => kvp.Key,
				kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray());

		return new BadRequestObjectResult(ApiResponseWrapper<object>.ValidationError(errors));
	};
});




// Set the minimum level to Debug
builder.Logging.SetMinimumLevel(LogLevel.Debug);



builder.Services.AddSignalR();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddHttpContextAccessor();


var app = builder.Build();

app.UseMiddleware<GlobalErrorExceptionHandlerMiddleware>();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
   
}



app.UseCors("AllowFrontEndOrigins");

app.UseMiddleware<GlobalErrorExceptionHandlerMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// Map the SignalR hub 
app.MapHub<MyHub>("/myHub");

app.Run();
