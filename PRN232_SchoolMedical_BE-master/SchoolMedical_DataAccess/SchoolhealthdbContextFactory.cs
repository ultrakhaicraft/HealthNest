using HealthNest_DAO.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO
{
	public class SchoolhealthdbContextFactory : IDesignTimeDbContextFactory<SchoolhealthdbContext>
	{
		public SchoolhealthdbContext CreateDbContext(string[] args)
		{
			var optionsBuilder = new DbContextOptionsBuilder<SchoolhealthdbContext>();

			//TODO: Replace with your actual connection string / MySQL server version
			optionsBuilder.UseMySQL("Server=localhost;Database=schoolhealthdb;Uid=root;Pwd=roots!22;Allow User Variables=True;");

			return new SchoolhealthdbContext(optionsBuilder.Options);
		}
	}
	
}
