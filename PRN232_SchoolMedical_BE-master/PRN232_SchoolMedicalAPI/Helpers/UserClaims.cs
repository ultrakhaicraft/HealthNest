using System.Security.Claims;

namespace PRN232_SchoolMedicalAPI.Helpers
{
	public static class UserClaims
	{
		public static string GetUserNameFromJwtToken(this IEnumerable<Claim> claims)
		{
			if (!claims.Any())
			{
				Console.WriteLine("Claims is empty, might due to Token not found or transfer here failed");
			}
			var userName = claims.FirstOrDefault(claims => claims.Type == ClaimTypes.Name)?.Value;
			return userName ?? "";
		}

		public static string GetUserIdFromJwtToken(this IEnumerable<Claim> claims)
		{
			if (!claims.Any())
			{
				Console.WriteLine("Claims is empty, might due to Token not found or transfer here failed");
			}
			var userId = claims.FirstOrDefault(claims => claims.Type == "id")?.Value;
			return userId ?? "";
		}

		public static string GetUserRoleFromJwtToken(this IEnumerable<Claim> claims)
		{
			if(!claims.Any())
			{
				Console.WriteLine("Claims is empty, might due to Token not found or transfer here failed");
			}
			var role = claims.FirstOrDefault(claims => claims.Type == ClaimTypes.Role)?.Value;
			return role ?? "";
		}
	}
}
