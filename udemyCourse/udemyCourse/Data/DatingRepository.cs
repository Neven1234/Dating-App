using Microsoft.EntityFrameworkCore;
using udemyCourse.Helpers;
using udemyCourse.Models;

namespace udemyCourse.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly AppDbContext _dbContext;

        public DatingRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void Add<T>(T entity) where T : class
        {
            _dbContext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbContext.Remove(entity);
        }

        public async Task<PageList<User>> GetAllAsync(UserParams userParams)
        {
            var users = _dbContext.Users.OrderByDescending(u => u.LastActive)
                .AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            if (userParams.Gender != null)
            {
                users = users.Where(u => u.Gender == userParams.Gender);
            }
            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));

            }
            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            if (userParams.MinAge != 18 || userParams.MaxAge != 90)
            {
                var minDOB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDOF = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDOB && u.DateOfBirth <= maxDOF);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }
            return await PageList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<User> GetAsync(int id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
            return user;
        }

        public async Task<Like> GetLike(int userId, int recipentId)
        {
            return await _dbContext.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipentId);

        }

        public async Task<Photo> GetMainPhoto(int userId)
        {

            return await _dbContext.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _dbContext.messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PageList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _dbContext.messages
                .AsQueryable();
            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId);
                    break;
                default:
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false && u.IsRead == false);
                    break;

            }
            messages = messages.OrderByDescending(d => d.MessageSent);
            return await PageList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<PageList<Message>> GetMessageTread(UserParams userParams)
        {
            var messages =  _dbContext.messages
              
               .Where(m => m.RecipientId == userParams.UserId && m.RecipientDeleted == false
               && m.SenderId == userParams.User2Id
               || m.RecipientId == userParams.User2Id && m.SenderDeleted == false && m.SenderId == userParams.UserId)
               .OrderByDescending(m=> m.Id)
               .AsQueryable();
            return await PageList<Message>.CreateAsync(messages, userParams.PageNumber, userParams.PageSize); ;
        }

        public async Task<Photo> GetPhotoAsynk(int id)
        {
            var photo = await _dbContext.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<bool> SaveAll()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }


        //heper function
        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == id);
            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id)
                    .Select(i => i.LikerId);

            }
            else
            {
                return user.Likees.Where(u => u.LikerId == id)
                    .Select(i => i.LikeeId);
            }
        }
        
    }
}
