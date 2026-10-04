using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using System.Text.Json.Serialization;
using SchoolMedical_DataAccess.Data;
using Microsoft.EntityFrameworkCore;
using HealthNest_API.Helpers;
using HealthNest_API;
using HealthNest_BusinessLogic.SignalRHubs;
using HealthNest_BusinessLogic;


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
