using Microsoft.AspNetCore.Http;
namespace udemyCourse.Helpers
{
    public static class Expetions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Conrol-Allow-Origin", "*");
        }

        public static int CalculateAge(this DateTime theDateOfBirth)
        {
            var age=DateTime.Today.Year - theDateOfBirth.Year;
            if(theDateOfBirth.AddYears(age)> DateTime.Today)
            {
                age--;
            }
            return age;
        }
    }
}
