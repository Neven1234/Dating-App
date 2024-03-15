using System.Xml.Serialization;
using udemyCourse.Helpers;
using udemyCourse.Models;

namespace udemyCourse.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<PageList<User>> GetAllAsync(UserParams userParams);
        Task<User> GetAsync(int id);
        Task <Photo> GetPhotoAsynk(int id);
        Task<Photo> GetMainPhoto(int userId);
        Task<Like> GetLike(int userId, int recipentId);
        Task<Message> GetMessage(int id);
        Task<PageList<Message>> GetMessagesForUser(MessageParams messageParams);
        Task<PageList<Message>> GetMessageTread(UserParams userParams);

    }
}
