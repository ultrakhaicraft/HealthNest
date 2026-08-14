using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels
{
	public class ErrorApiResponseWrapper
	{
		public int StatusCode { get; set; }
		public string Message { get; set; }
		public string? Detail { get; set; }
		public DateTime Timestamp { get; set; } = DateTime.UtcNow;
	}

	public class ApiResponseWrapper<T>
	{
		public int StatusCode { get; set; }
		public string Message { get; set; } = string.Empty;
		public T? Data { get; set; }
		public DateTime Timestamp { get; set; } = DateTime.UtcNow;
	}
}
