using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SchoolMedical_DataAccess.DTOModels;

namespace SchoolMedical_BusinessLogic.Utility;

public static class PagingExtension
{
	/// <summary>
	/// Extension method to paginate a list of items from an IQueryable source.
	/// </summary>
	/// <typeparam name="T">Type of the items in the list.</typeparam>
	/// <param name="source">The source list to be paginated.</param>
	/// <param name="pageIndex">The index of the page to retrieve (1-based).</param>
	/// <param name="pageSize">The number of items per page.</param>
	/// <returns>A paginated list of items.</returns>
	public async static Task<PagingModel<T>> ToPagingModel<T>(IQueryable<T> source, int pageIndex, int pageSize)
	{
		var totalCount =await source.CountAsync();
		var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
		var data = await source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToListAsync();
		return new PagingModel<T>
		{
			PageIndex = pageIndex,
			PageSize = pageSize,
			TotalCount = totalCount,
			TotalPages = totalPages,
			Data = data
		};
	}

	/// <summary>
	/// Extension method to paginate a list of items from an IList source.
	/// </summary>
	/// <typeparam name="T">Type of the items in the list.</typeparam>
	/// <param name="source">The source list to be paginated.</param>
	/// <param name="pageIndex">The index of the page to retrieve (1-based).</param>
	/// <param name="pageSize">The number of items per page.</param>
	/// <returns>A paginated list of items.</returns>
	public async static Task<PagingModel<T>> ToPagingModel<T>(IList<T> source, int pageIndex, int pageSize)
	{
		var totalCount = source.Count;
		var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
		var data = source.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
		return new PagingModel<T>
		{
			PageIndex = pageIndex,
			PageSize = pageSize,
			TotalCount = totalCount,
			TotalPages = totalPages,
			Data = data
		};
	}
}
