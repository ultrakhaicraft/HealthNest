using SchoolMedical_BusinessLogic.Utility;
using System.Net;
using System.Text.Json;

namespace PRN232_SchoolMedicalAPI.Helpers;

public class ErrorHandlerMiddleware
{
	private readonly RequestDelegate _next;
	private readonly ILogger _logger;

	public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
	{
		_next = next;
		_logger = logger;
	}

	public async Task Invoke(HttpContext context)
	{
		try
		{
			await _next(context);

			// Kiểm tra trạng thái HTTP sau khi xử lý request
			if (context.Response.StatusCode == (int)HttpStatusCode.Unauthorized)
			{
				var response = context.Response;
				response.ContentType = "application/json";

				var result = JsonSerializer.Serialize(new
				{
					message = "You are not logged in.",
					statusCode = response.StatusCode
				});

				await response.WriteAsync(result);
			}
			else if (context.Response.StatusCode == (int)HttpStatusCode.Forbidden)
			{
				var response = context.Response;
				response.ContentType = "application/json";

				var result = JsonSerializer.Serialize(new
				{
					message = "You do not have permission access.",
					statusCode = response.StatusCode
				});

				await response.WriteAsync(result);
			}
		}
		catch (Exception error)
		{
			var response = context.Response;
			response.ContentType = "application/json";

			switch (error)
			{
				case AppException e:
					// custom application error
					response.StatusCode = (int)HttpStatusCode.BadRequest;
					break;
				case KeyNotFoundException e:
					// not found error
					response.StatusCode = (int)HttpStatusCode.NotFound;
					break;
				default:
					// unhandled error
					_logger.LogError(error, error.Message);
					response.StatusCode = (int)HttpStatusCode.InternalServerError;
					break;
			}

			var result = JsonSerializer.Serialize(new
			{
				message = error?.Message,
				statusCode = response.StatusCode
			});

			await response.WriteAsync(result);
		}
	}

}
