using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
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

            SendMessageToRabbitMQ(userConnection.Room!, new[] { new { Content = $"{userConnection.User} se unió a la sala", User = userConnection.User!, Date = DateTime.Now } });

            await SendConnectedUser(userConnection.Room!);
        }

        public async Task SendMessage(string message)
		{
			if (_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection userRoomConnection))
			{
                SendMessageToRabbitMQ(userRoomConnection.Room!, new[] { new { Content = message, User = userRoomConnection.User!, Date = DateTime.Now } });
            }
		}

        public override Task OnDisconnectedAsync(Exception? exp)
        {
			if (!_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection userRoomConnection))
			{
				return base.OnDisconnectedAsync(exp);
			}

            _connection.Remove(Context.ConnectionId);

            //Clients.Group(userRoomConnection.Room!)
            //    .SendAsync("ReceiveMessage", new[] { new { Content = $"{userRoomConnection.User} abandonó la sala" } });
            SendMessageToRabbitMQ(userRoomConnection.Room!, new[] { new { Content = $"{userRoomConnection.User} abandonó la sala", User = userRoomConnection.User!, Date = DateTime.Now } });

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

        private void SendMessageToRabbitMQ(string room, object content)
        {
            var factory = new ConnectionFactory() { HostName = "localhost", UserName = "guest", Password = "guest" };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "chat",
                                    durable: false,
                                    exclusive: false,
                                    autoDelete: false,
                                    arguments: null);

                string message = JsonSerializer.Serialize(content);
                var body = Encoding.UTF8.GetBytes(message);

                channel.BasicPublish(exchange: "",
                                     routingKey: room,
                                     basicProperties: null,
                                     body: body);

                Console.WriteLine($"[x] Sent '{message}'");
            }
        }

    }
}

