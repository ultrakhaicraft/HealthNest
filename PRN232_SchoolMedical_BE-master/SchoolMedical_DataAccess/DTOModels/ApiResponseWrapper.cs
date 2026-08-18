using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels
{
	

	public class ApiResponseWrapper<T>
	{
		public int StatusCode { get; set; }
		public string Message { get; set; } = string.Empty;
		public T? Data { get; set; }
		public T? Error { get; set; } //Only for error response

		public DateTime Timestamp { get; set; } = DateTime.UtcNow;


		//Static Factory method
		public static ApiResponseWrapper<T> Success(T data, string message)
		{
			return new ApiResponseWrapper<T>()
			{
				StatusCode = 200,
				Message = message,
				Data = data
			};
		}

		public static ApiResponseWrapper<T> Created(T data, string message)
		{
			return new ApiResponseWrapper<T>()
			{
				StatusCode = 201,
				Message = message,
				Data = data
			};
		}

		public static ApiResponseWrapper<T> NoContent(string message)
		{
			return new ApiResponseWrapper<T>()
			{
				StatusCode = 204,
				Message = message,
			};
		}

		public static ApiResponseWrapper<T> ErrorResponse(int statusCode,T error, string message)
		{
			return new ApiResponseWrapper<T>()
			{
				StatusCode = statusCode,
				Message = message,
				Error = error,
			};
		}

		public static ApiResponseWrapper<T> ValidationError(T errors)
		{
			return new ApiResponseWrapper<T>
			{
				StatusCode = 400,
				Message = "Validation failed",
				Error = errors 
			};
		}

	}
}
