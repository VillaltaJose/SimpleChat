using System.Text;
using Microsoft.AspNetCore.SignalR;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Server.API.Hub;

namespace Server.API
{
    public class RabbitMQConsumer
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public RabbitMQConsumer(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public void StartConsuming()
        {
            Task.Run(() =>
            {
                Console.WriteLine("Ejecutando Rabbit");

                var factory = new ConnectionFactory() { HostName = "localhost", UserName = "guest", Password = "guest" };

                using (var connection = factory.CreateConnection())
                using (var channel = connection.CreateModel())
                {
                    // Declarar la cola 'chat' si no existe
                    channel.QueueDeclare(queue: "chat", durable: false, exclusive: false, autoDelete: false, arguments: null);

                    var consumer = new EventingBasicConsumer(channel);
                    consumer.Received += (model, ea) =>
                    {
                        Console.WriteLine("HERE");
                        var body = ea.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);

                        // Procesar el mensaje y enviarlo a SignalR
                        _hubContext.Clients.All.SendAsync("ReceiveMessage", message);

                        Console.WriteLine(" [x] Received {0}", message);
                    };

                    channel.BasicConsume(queue: "chat",
                                        autoAck: true,
                                        consumer: consumer);

                    Console.WriteLine(" [*] Waiting for messages.");
                    Console.WriteLine("Presiona cualquier tecla para detener el consumidor.");

                    // Mantener el consumidor activo hasta que se presione una tecla
                    Console.ReadKey();
                }
            });
        }
    }
}

