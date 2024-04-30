using Microsoft.AspNetCore.SignalR;
using Server.API.Entities;

namespace Server.API.Hub
{
    public class ChatHub : Microsoft.AspNetCore.SignalR.Hub
    {
		private readonly IDictionary<string, UserRoomConnection> _connection;

		public ChatHub(
            IDictionary<string, UserRoomConnection> connection
		)
		{
			_connection = connection;
		}

		public async Task JoinRoom(UserRoomConnection userConnection)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Room!);
			_connection[Context.ConnectionId] = userConnection;
			await Clients.Group(userConnection.Room!)
                .SendAsync("ReceiveMessage", new[] { new { Content = $"{userConnection.User} has joined the group" } } );
			await SendConnectedUser(userConnection.Room!);
		}

		public async Task SendMessage(string message)
		{
			if (_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection userRoomConnection))
			{
				await Clients.Group(userRoomConnection.Room!)
					.SendAsync("ReceiveMessage", new[]
					{
						new { Content = message, User = userRoomConnection.User!, Date = DateTime.Now }
					});
			}
		}

        public override Task OnDisconnectedAsync(Exception? exp)
        {
			if (!_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection userRoomConnection))
			{
				return base.OnDisconnectedAsync(exp);
			}

            _connection.Remove(Context.ConnectionId);

            Clients.Group(userRoomConnection.Room!)
                .SendAsync("ReceiveMessage", new[] { new { Content = $"{userRoomConnection.User} has left the group" } });

            SendConnectedUser(userRoomConnection.Room!);
			return base.OnDisconnectedAsync(exp);
        }

        public Task SendConnectedUser(string room)
        {
            var users = _connection.Values
                .Where(u => u.Room == room)
                .Select(s => s.User);

            return Clients.Group(room).SendAsync("ConnectedUser", users);
        }
    }
}

