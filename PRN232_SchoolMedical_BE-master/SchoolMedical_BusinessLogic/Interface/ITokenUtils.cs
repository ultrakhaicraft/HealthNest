using HealthNest_DAO.DTOModels;
using HealthNest_DAO.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Interface;

public interface ITokenUtils
{
	public Task<(string accessToken, string refreshToken)> GenerateTokens(Account account);
	public Task<TokensDTO> RefreshToken(TokensDTO tokens);

}
