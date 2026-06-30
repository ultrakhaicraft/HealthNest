using Microsoft.AspNetCore.SignalR;
using SchoolMedical_DataAccess.DTOModels;



namespace SchoolMedical_BusinessLogic.SignalRHubs
{
	// This class represents a SignalR hub for handling incident records.
	public class IncidentRecordHub : Hub 
	{

		public IncidentRecordHub() { }

		// Notify all connected clients about a new incident record, which updates the 
		// incident record list in real-time.

		public async Task NotifyIncidentRecordAdded(IncidentRecordDetailModel data)
		{
			await Clients.All.SendAsync("IncidentRecordAdded", data);
		}

		// Notify all connected clients about an updated incident record, which updates the
		// incident record list in real-time.

		public async Task NotifyIncidentRecordUpdated(IncidentRecordDetailModel data)
		{
			await Clients.All.SendAsync("IncidentRecordUpdated", data);
		}

		// Notify all connected clients about a deleted incident record, which updates the
		// incident record list in real-time.

		public async Task NotifyIncidentRecordDeleted()
		{
			await Clients.All.SendAsync("IncidentRecordDeleted");
		}

		// This method is called when a client connects to the hub.
		public override async Task OnConnectedAsync()
		{
			await base.OnConnectedAsync();
		}


		// This method is called when a client disconnects from the hub.
		public override async Task OnDisconnectedAsync(Exception? exception)
		{
			await base.OnDisconnectedAsync(exception);
		}
	}
}
