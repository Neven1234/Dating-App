using Microsoft.AspNetCore.Mvc.Filters;
using udemyCourse.Data;
using Microsoft.Extensions.DependencyInjection;
namespace udemyCourse.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            var userId = int.Parse(resultContext.HttpContext.User.FindFirst("userId").Value);
            var repo = resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user=await repo.GetAsync(userId);
            user.LastActive = DateTime.Now;
            await repo.SaveAll();

        }
    }
}
