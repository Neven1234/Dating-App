using udemyCourse.Models;
using Microsoft.EntityFrameworkCore;
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

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            var users= await _dbContext.Users.Include(p=>p.Photos).ToListAsync();
            return users;
        }

        public async Task<User> GetAsync(int id)
        {
            var user = await _dbContext.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x => x.Id == id);
            return user;
        }

        public async Task<bool> SaveAll()
        {
            return await _dbContext.SaveChangesAsync() > 0;
        }
    }
}
