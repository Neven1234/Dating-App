using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using udemyCourse.Models;

namespace udemyCourse.Helpers
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class MessageHub:Hub
    {
        public override Task OnConnectedAsync()
        {
            //Groups.AddToGroupAsync(Context.ConnectionId, Context.User.FindFirstValue("name"));
            return base.OnConnectedAsync();
        }
        public Task JoinGroup(string sender, string receiver)
        {
            //message send to receiver only
            return Groups.AddToGroupAsync(Context.ConnectionId, sender + receiver);
           
        }

       

    }
}
