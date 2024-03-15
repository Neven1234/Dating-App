using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;
using udemyCourse.Dtos;

namespace udemyCourse.Helpers
{
    public class HubService
    {
        private readonly IHubContext<MessageHub> _hubContext;

        public HubService(IHubContext<MessageHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public Task SendMessageToGroup(string sender, string receiver, MessageToReturnDTO messageToReturn)
        {
            //message send to receiver only
            return _hubContext.Clients.Group(sender + receiver).SendAsync("ReceiveMessage", messageToReturn);
        }



    }
}
