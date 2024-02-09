﻿using udemyCourse.Models;
using Microsoft.EntityFrameworkCore;
using udemyCourse.Helpers;

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
            var users = _dbContext.Users.Include(p => p.Photos);

            return await PageList<User>.CreateAsync(users,userParams.PageNumber,userParams.PageSize);
        }

        public async Task<User> GetAsync(int id)
        {
            var user = await _dbContext.Users.Include(p=>p.Photos).FirstOrDefaultAsync(x => x.Id == id);
            return user;
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
           
            return await _dbContext.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
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
    }
}
