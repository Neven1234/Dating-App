
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using udemyCourse.Dtos;
using udemyCourse.Models;

namespace udemyCourse
{
    public interface IUserRepository
    {
        Task<User> Register(User user, string password);

        Task<object> Login(string username, string password);
        Task<bool> UserExist(string username);
        Task <object> LoginWithGoogle(LoginWithGoogleDTO googleDTO);
        Task<object> RegisterByGoogle(User user);

    }
}
