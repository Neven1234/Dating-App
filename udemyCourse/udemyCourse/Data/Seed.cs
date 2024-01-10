
using Newtonsoft.Json;
using udemyCourse.Models;

namespace udemyCourse.Data
{
    public class Seed
    {
        public static void SeedUsers(AppDbContext dbContext )
        {
            if(!dbContext.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach(var user in users)
                {
                    byte[] passwordHash, passworSalt;
                    CreatePasswordHash("Password",out passwordHash,out passworSalt);
                    user.PasswordHash=passwordHash;
                    user.PasswordSalt=passworSalt;
                    user.Username=user.Username.ToLower();
                    dbContext.Users.Add(user);
                    dbContext.SaveChanges();
                }
                
            }
        }
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }
    }
}
