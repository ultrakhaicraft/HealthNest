using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_BusinessLogic.Utility;

// Base exception — all your custom exceptions inherit from this
public class AppException : Exception
{
	public int StatusCode { get; }

	public AppException(string message, int statusCode = StatusCodes.Status400BadRequest)
		: base(message)
	{
		StatusCode = statusCode;
	}
}

// 400
public class BadRequestException : AppException
{
	public BadRequestException(string message)
		: base(message, StatusCodes.Status400BadRequest) { }
}

// 401
public class UnauthorizedException : AppException
{
	public UnauthorizedException(string message = "Unauthorized")
		: base(message, StatusCodes.Status401Unauthorized) { }
}

// 403
public class ForbiddenException : AppException
{
	public ForbiddenException(string message = "Access denied")
		: base(message, StatusCodes.Status403Forbidden) { }
}

// 404
public class NotFoundException : AppException
{
	public NotFoundException(string resource, string id)
		: base($"{resource} with id '{id}' was not found", StatusCodes.Status404NotFound) { }

	public NotFoundException(string message)
		: base(message, StatusCodes.Status404NotFound) { }
}

// 409
public class ConflictException : AppException
{
	public ConflictException(string message)
		: base(message, StatusCodes.Status409Conflict) { }
}
