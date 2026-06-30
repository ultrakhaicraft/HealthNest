using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels;


public class DBConnection
{
	public string? ConnectionString { get; set; } = string.Empty;
}

/// <summary>
/// JWTToken is also used as login response, which only return token
/// If you want to return user data, call user detail API instead.
/// </summary>
public class JWTToken
{
	public string? TokenString { get; set; }
	public long ExpiresInMilliseconds { get; set; }
}

public class JwtModel
{
	public string? ValidAudience { get; set; }
	public string? ValidIssuer { get; set; }
	public string? SecretKey { get; set; }
}

public class TokenResponse
{
	[JsonPropertyName("access_token")]
	public string? AccessToken { get; set; }

	[JsonPropertyName("expires_in")]
	public int ExpiresIn { get; set; }

	[JsonPropertyName("token_type")]
	public string? TokenType { get; set; }

	[JsonPropertyName("id_token")]
	public string? IdToken { get; set; }

	[JsonPropertyName("refresh_token")]
	public string? RefreshToken { get; set; }
}

public class ResultApi
{
	public string StatusCode { get; set; } = string.Empty;
	public string Message { get; set; } = string.Empty;
	public object? Data { get; set; }

}

