using HealthNest_BusinessLogic.Interface;
using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using HealthNest_DAO.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Utilities.Collections;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Utility;

public class TokenUtils  : ITokenUtils
{
	private readonly IConfigurationSection jwtSettings;
	private readonly IUnitOfWork _unitOfWork;
	private readonly IHttpContextAccessor _httpContextAccessor;

	public TokenUtils(IConfiguration configuration, IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
	{
		jwtSettings = configuration.GetSection("JwtSettings");
		_unitOfWork = unitOfWork;
		_httpContextAccessor = httpContextAccessor;
	}

	public async Task<(string accessToken, string refreshToken)> GenerateTokens(Account account)
	{
		string accessToken = GenerateAccessToken(account).TokenString ?? string.Empty;
		if (string.IsNullOrEmpty(accessToken))
		{
			throw new InternalServerException("Unable to generate access token");
		}
		string refreshTokenString = GenerateRefreshToken();

		var storedRefreshTOken = new RefreshToken
		{
			Id =  Guid.NewGuid().ToString(),
			AccountId = account.Id,
			CreatedAt = DateTime.UtcNow,
			ExpiresAt = DateTime.UtcNow.AddDays(Convert.ToDouble(jwtSettings["RefreshTokenExpiryDays"])),
			TokenHash = Hash(refreshTokenString),
			CreatedByIp = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString() //Get Ip Address to check

		};
		await _unitOfWork.GetRepository<RefreshToken>().InsertAsync(storedRefreshTOken);
		await _unitOfWork.SaveAsync();
		
		return(accessToken, refreshTokenString);
	}

	public async Task<TokensDTO> RefreshToken(TokensDTO tokens)
	{
		var principal = GetClaimsPrincipalFromExpiredAccessToken(tokens.AccessTokenString);

		var accountIdClaim = principal.FindFirst("AccountId")?.Value;
		if (string.IsNullOrEmpty(accountIdClaim))
		{
			throw new UnauthorizedException("Invalid token: missing account identifier");
		}

		var hashedRefreshToken = Hash(tokens.RefreshTokenString);

		var userToken = await _unitOfWork.GetRepository<RefreshToken>().FindAsync(u => u.TokenHash == hashedRefreshToken);

		if (userToken == null || userToken.AccountId != accountIdClaim || userToken.ExpiresAt < DateTime.UtcNow )
		{
			throw new UnauthorizedException("Refresh token is invalid or expired");
		}

		var account = await _unitOfWork.GetRepository<Account>().GetByIdAsync(accountIdClaim);

		if(account == null)
		{
			throw new NotFoundException("Unable to get Account from Id Claim");
		}

		string newAccessToken = GenerateAccessToken(account).TokenString ?? string.Empty;

		if(string.IsNullOrEmpty(newAccessToken))
		{
			throw new InternalServerException("Unable to Generate access token");
		}

		string newRefreshToken = GenerateRefreshToken();

		try
		{
			await _unitOfWork.BeginTransactionAsync();
			userToken.RevokeAt = DateTime.UtcNow;
			_unitOfWork.GetRepository<RefreshToken>().Update(userToken);

			await _unitOfWork.GetRepository<RefreshToken>().InsertAsync(new RefreshToken
			{
				AccountId = account.Id,
				TokenHash = Hash(newRefreshToken),
				ExpiresAt = DateTime.UtcNow.AddDays(Convert.ToDouble(jwtSettings["RefreshTokenExpiryDays"])),
				CreatedAt = DateTime.UtcNow
			});

			await _unitOfWork.SaveAsync();
			await _unitOfWork.CommitTransactionAsync();

			return new TokensDTO
			{
				AccessTokenString = newAccessToken,
				RefreshTokenString = newRefreshToken,

			};
		}
		catch (Exception)
		{
			await _unitOfWork.RollBackAsync();
			throw;
		}


	}



	private JWTToken GenerateAccessToken(Account account)
	{
		JwtModel? jwtModel = jwtSettings.Get<JwtModel>();
		if (jwtModel == null)
		{
			throw new AppException("JWT model cannot be null");
		}

		var authClaims = new List<Claim>
		{
			new Claim("AccountId", account.Id),
			new Claim(ClaimTypes.Name, account.FullName?? "N/A"),
			new Claim(ClaimTypes.Email, account.Email ?? "N/A"),
			new Claim(ClaimTypes.Role, account.Role ?? "N/A"),
			new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
		};


		var authSignKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtModel?.SecretKey ?? ""));
		var expirationTime = DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["AccessTokenExpiryMinutes"]));
		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Issuer = jwtModel?.ValidIssuer,
			Audience = jwtModel?.ValidAudience,
			Expires = expirationTime,
			SigningCredentials = new SigningCredentials(authSignKey, SecurityAlgorithms.HmacSha256),
			Subject = new ClaimsIdentity(authClaims)
		};
		var tokenHandler = new JwtSecurityTokenHandler();
		var token = tokenHandler.CreateToken(tokenDescriptor);
		var tokenString = tokenHandler.WriteToken(token);
		var jwtToken = new JWTToken
		{
			TokenString = tokenString,
			ExpiresInMilliseconds = (long)(expirationTime - DateTime.UtcNow).TotalMilliseconds
		};
		return jwtToken;
	}

	private string GenerateRefreshToken()
	{
		var refreshTokenString = string.Empty;
		var random = new byte[32];
		using(var rng = RandomNumberGenerator.Create())
		{
			rng.GetBytes(random);
			refreshTokenString = Convert.ToBase64String(random);
		}

		return refreshTokenString;

	}


	//Extract Claims from AccessToken
	private ClaimsPrincipal GetClaimsPrincipalFromExpiredAccessToken(string expiredAccessToken)
	{
		var tokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateIssuerSigningKey = true,
			ValidateLifetime = true,
			ValidAudience = jwtSettings["ValidAudience"],
			ValidIssuer = jwtSettings["ValidIssuer"],
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? ""))
		};

		var tokenHandler = new JwtSecurityTokenHandler();
		SecurityToken securityToken;
		var principal = tokenHandler.ValidateToken(expiredAccessToken, tokenValidationParameters, out securityToken);
		var jwtSecurityToken = securityToken as JwtSecurityToken;
		if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
		{
			throw new SecurityTokenException("Invalid token");
		}

		return principal;
		
	}

	private string Hash(string token)
	{
		using var sha256 = SHA256.Create();
		var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));
		return Convert.ToBase64String(bytes);
	}
}

