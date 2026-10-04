using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.Entities
{
	public class RefreshToken
	{
		public string Id { get; set; } = string.Empty;
		public string AccountId { get; set; } = string.Empty;
		public string TokenHash { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; }
		public DateTime ExpiresAt { get; set; }
		public DateTime? RevokeAt { get; set; }
		public string? CreatedByIp { get; set; }
	}
}
