using SchoolMedical_BusinessLogic.Utility;

namespace PRN232_SchoolMedicalAPI.Helpers
{
	public class GlobalErrorExceptionHandlerMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly ILogger<GlobalErrorExceptionHandlerMiddleware> _logger;

		public GlobalErrorExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalErrorExceptionHandlerMiddleware> logger)
		{
			_next = next;
			_logger = logger;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			try
			{
				await _next(context);
			}
			catch (AppException ex)
			{
				// Known, intentional exceptions — log as warning, not error
				_logger.LogWarning("AppException [{StatusCode}]: {Message}", ex.StatusCode, ex.Message);
				await WriteErrorResponse(context, ex.StatusCode, ex.Message);
			}
			catch (Exception ex)
			{
				// Unknown/unexpected — log as full error with stack trace
				_logger.LogError(ex, "Unhandled exception on {Method} {Path}",
					context.Request.Method, context.Request.Path);

				await WriteErrorResponse(context,
					StatusCodes.Status500InternalServerError,
					"An unexpected error occurred",
					detail: ex.Message); // optionally hide in prod
			}
		}

		public async Task WriteErrorResponse(HttpContext context, int statusCode, string message, string? detail=null)
		{
			context.Response.ContentType = "application/json";
			context.Response.StatusCode = statusCode;

			var response = new
			{
				StatusCode = statusCode,
				Message = message,
				Detail = detail
			};

			await context.Response.WriteAsJsonAsync(response);
		}
	}
}
