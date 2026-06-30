using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json.Serialization;
using System.Text.Json;
using SchoolMedical_DataAccess.DTOModels;

namespace PRN232_SchoolMedicalAPI.Helpers;

public class ResponseHandlerMiddleware
{
	private readonly RequestDelegate _next;

	public ResponseHandlerMiddleware(RequestDelegate next)
	{
		_next = next;
	}

	public async Task Invoke(HttpContext context)
	{

		await _next(context);
	}
}



public class ResultManipulator : IResultFilter
{
	public void OnResultExecuted(ResultExecutedContext context)
	{
		// throw new NotImplementedException();
	}

	public void OnResultExecuting(ResultExecutingContext context)
	{
		var result = context.Result as ObjectResult;
		if (result != null)
		{
			if (context.HttpContext.Response.StatusCode >= 400)
			{
				return;
			}

			var resultObj = result.Value;

			var resp = new ResultApi
			{
				StatusCode = context.HttpContext.Response.StatusCode.ToString()

			};

			if (!context.ModelState.IsValid)
			{
				var validationErrors = context.ModelState
					.Where(entry => entry.Value.Errors.Any())
					.ToDictionary(
						entry => entry.Key,
						entry => entry.Value.Errors.Select(error => error.ErrorMessage).ToArray()
					);

				resp.StatusCode = "400";
				resp.Message = "Validation failed";
				resp.Data = validationErrors;

				// Return the response with validation errors
				context.Result = new JsonResult(resp, new JsonSerializerOptions
				{
					PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
					DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
					Converters = { new JsonStringEnumConverter() }
				});

				context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

				return;
			}

			if (context.HttpContext.Items.TryGetValue("CustomMessage", out var message))
			{
				resp.Message = message as string ?? "Success";
			}
			else
			{
				resp.Message = "Success"; // Default
			}

			if (resultObj is not null)
				resp.Data = resultObj;

			//you can also change this from System.Text.Json to newtonsoft if you use newtonsoft
			context.Result = new JsonResult(resp, new JsonSerializerOptions()
			{
				PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
				DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
				Converters = { new JsonStringEnumConverter() }
			});
		}

	}

}
