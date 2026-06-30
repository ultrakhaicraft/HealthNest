using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolMedical_DataAccess.DTOModels;

/// <summary>
/// PagingModel is a generic class that represents a paginated response.
/// Data is a list of type T. Contain actual data for the page.
/// Credit: It's from a friend in SWD 2023 class.
/// </summary>
/// <typeparam name="T"></typeparam>
public class PagingModel<T>
{
	public int PageIndex { get; set; }
	public int TotalPages { get; set; }
	public int PageSize { get; set; }
	public int TotalCount { get; set; }
	public bool HasPrevious => PageIndex > 1;
	public bool HasNext => PageIndex < TotalPages;
	public List<T>? Data { get; set; }

}
