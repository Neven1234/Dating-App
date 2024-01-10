using System.Xml.Serialization;
using udemyCourse.Models;

namespace udemyCourse.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetAsync(int id);
    }
}
