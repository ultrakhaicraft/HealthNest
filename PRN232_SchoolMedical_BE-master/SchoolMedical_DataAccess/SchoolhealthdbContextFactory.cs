using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using SchoolMedical_DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess
{
	public class SchoolhealthdbContextFactory : IDesignTimeDbContextFactory<SchoolhealthdbContext>
	{
		public SchoolhealthdbContext CreateDbContext(string[] args)
		{
			var optionsBuilder = new DbContextOptionsBuilder<SchoolhealthdbContext>();

			// Replace with your actual connection string / MySQL server version
			optionsBuilder.UseMySQL("server=127.0.0.1;port=3306;user=FPPTAdmin;password=AF3dmPPTn2!;database=schoolhealthdb;");

			return new SchoolhealthdbContext(optionsBuilder.Options);
		}
	}
	
}
