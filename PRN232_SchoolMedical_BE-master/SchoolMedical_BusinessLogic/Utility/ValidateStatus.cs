using HealthNest_DAO.Entities;
using HealthNest_DAO.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HealthNest_BusinessLogic.Utility;

public static class ValidateEventStatus
{
	private static  IReadOnlyDictionary<EventStatus, EventStatus[]> AllowedTransitions =
	new Dictionary<EventStatus, EventStatus[]>
	{
		[EventStatus.Pending] = new[] { EventStatus.Signup, EventStatus.Cancelled },
		[EventStatus.Signup] = new[] { EventStatus.Upcoming, EventStatus.Cancelled },
		[EventStatus.Upcoming] = new[] { EventStatus.Ongoing, EventStatus.Cancelled },
		[EventStatus.Ongoing] = new[] { EventStatus.Completed },
		[EventStatus.Completed] = Array.Empty<EventStatus>(),
		[EventStatus.Cancelled] = Array.Empty<EventStatus>(),
	};

	public static EventStatus ParseStatus(string? value)
	{
		if (!Enum.TryParse<EventStatus>(value, ignoreCase: true, out var status)
			|| !Enum.IsDefined(status))
			throw new BadRequestException($"Invalid status '{value}'.");
		return status;
	}

	private static string Fmt(DateTime? d) =>
	d.HasValue ? $"{d.Value:O} (Kind={d.Value.Kind})" : "NULL";
	public static void ValidateEventStatusTransition(Vaccineevent current, EventStatus newStatus, DateTime now)
	{
		

		if (!Enum.TryParse<EventStatus>(current.Status, ignoreCase: true, out var currentStatus))
			throw new InvalidOperationException(
				$"Vaccine event {current.Id} has an invalid status '{current.Status}'.");

		//Return early if same Status
		if (currentStatus == newStatus)
		{
			return;
		}

		//Check if we can change the status by order
		var allowed = AllowedTransitions[currentStatus].Contains(newStatus);
		if (!allowed)
			throw new BadRequestException($"Cannot change status from {currentStatus} to {newStatus}.");

		if (currentStatus == EventStatus.Pending && newStatus == EventStatus.Signup)
		{

			if (!current.DateSignupStart.HasValue || !current.DateSignupEnd.HasValue)
				throw new BadRequestException(
					"Sign-up start and end dates must be set before opening sign-up.");

			if (now < current.DateSignupStart.Value || now > current.DateSignupEnd.Value)
				throw new BadRequestException(
					$"Sign-up can only open between {current.DateSignupStart.Value:g} and {current.DateSignupEnd.Value:g}.");
		}

		if (currentStatus == EventStatus.Signup
			&& newStatus == EventStatus.Upcoming
			&& current.DateSignupEnd.HasValue)
		{
			Console.WriteLine($">>> SignUp -> Upcoming check: now <= end is {now <= current.DateSignupEnd.Value}");
			if (now <= current.DateSignupEnd.Value)
				throw new BadRequestException(
					$"Sign-up is still open until {current.DateSignupEnd.Value:g}. The event cannot move to Upcoming before then.");
		}

	}
}


public static class ValidateAttendantStatus
{
	private static IReadOnlyDictionary<AttentdanceStatus, AttentdanceStatus[]> AllowedTransitions =
	new Dictionary<AttentdanceStatus, AttentdanceStatus[]>
	{
		[AttentdanceStatus.Pending] = new[] { AttentdanceStatus.Approved,AttentdanceStatus.Rejected,AttentdanceStatus.Cancelled},
		[AttentdanceStatus.Approved] = new[] { AttentdanceStatus.Completed },
		[AttentdanceStatus.Completed] = Array.Empty<AttentdanceStatus>(),
		[AttentdanceStatus.Rejected] = Array.Empty<AttentdanceStatus>(),
		[AttentdanceStatus.Cancelled] = Array.Empty<AttentdanceStatus>(),
	};

	public static AttentdanceStatus ParseStatus(string? value)
	{
		if (!Enum.TryParse<AttentdanceStatus>(value, ignoreCase: true, out var status)
			|| !Enum.IsDefined(status))
			throw new BadRequestException($"Invalid status '{value}'.");
		return status;
	}

	private static string Fmt(DateTime? d) =>
	d.HasValue ? $"{d.Value:O} (Kind={d.Value.Kind})" : "NULL";
	public static void ValidateEventStatusTransition(VaccineeventStudent current, AttentdanceStatus newStatus)
	{


		if (!Enum.TryParse<AttentdanceStatus>(current.Status, ignoreCase: true, out var currentStatus))
			throw new InvalidOperationException(
				$"Vaccine event participant with event Id: {current.VaccineeventId} and Student Id: {current.StudentId} has an invalid status '{current.Status}'.");

		//Return early if same Status
		if (currentStatus == newStatus)
		{
			return;
		}

		//Check if we can change the status by order
		var allowed = AllowedTransitions[currentStatus].Contains(newStatus);
		if (!allowed)
			throw new BadRequestException($"Cannot change status from {currentStatus} to {newStatus}.");

		
	}
}
