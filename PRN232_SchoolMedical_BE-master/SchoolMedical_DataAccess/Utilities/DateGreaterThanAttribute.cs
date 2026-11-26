using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_DAO.Utilities;

[AttributeUsage(AttributeTargets.Property)]
public sealed class DateGreaterThanAttribute : ValidationAttribute
{
	private readonly string _comparisonProperty;

	public DateGreaterThanAttribute(string comparisonProperty)
	{
		_comparisonProperty = comparisonProperty;
	}

	protected override ValidationResult? IsValid(object value,ValidationContext validationContext)
	{
		var currentValue = value as DateTime?;

		// Use reflection to get the other property's value
		var property = validationContext.ObjectType.GetProperty(_comparisonProperty);
		if (property == null)
		{
			throw new ArgumentException($"Property '{_comparisonProperty}' not found.");
		}

		var comparisonValue = property.GetValue(validationContext.ObjectInstance) as DateTime?;

		if (currentValue.HasValue && comparisonValue.HasValue && currentValue <= comparisonValue)
		{
			return new ValidationResult(
				ErrorMessage ?? $"{validationContext.DisplayName} must be after {_comparisonProperty}."
			);
		}

		return ValidationResult.Success;
	}
}
