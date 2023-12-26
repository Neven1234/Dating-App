using DomainLayer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RepositoryLayer
{
    public interface IRepository
    {
        Task<User> Register(User user, string password);
        Task<User> Login(User user, string password);
        Task<bool> UserExist(string username);


    }
}
