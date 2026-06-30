using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using SchoolMedical_DataAccess.DTOModels;
using SchoolMedical_DataAccess.Entities;
using SchoolMedical_BusinessLogic.Interface;

namespace SchoolMedical_BusinessLogic.Utility;

public class JwtUtils  : IJwtUtils
{
	public JWTToken GenerateToken(IEnumerable<Claim> claims, JwtModel? jwtModel, Account account)
	{
		if(jwtModel == null)
		{
			throw new AppException("JWT model cannot be null");
		}
		var authSignKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtModel?.SecretKey ?? ""));
		var expirationTime = DateTime.UtcNow.AddHours(2);
		var tokenDescriptor = new SecurityTokenDescriptor
		{
			Issuer = jwtModel?.ValidIssuer,
			Audience = jwtModel?.ValidAudience,
			Expires = expirationTime,
			SigningCredentials = new SigningCredentials(authSignKey, SecurityAlgorithms.HmacSha256),
			Subject = new ClaimsIdentity(claims)
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
}
