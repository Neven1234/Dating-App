
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using udemyCourse.Models;

namespace udemyCourse
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Like>()
                .HasKey(k => new { k.LikerId , k.LikeeId });
            modelBuilder.Entity<Like>()
                .HasOne(u=>u.Likee)
                .WithMany(u=>u.Likers)
                .HasForeignKey(u=>u.LikeeId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Like>()
                .HasOne(u=>u.Liker)
                .WithMany(u=>u.Likees)
                .HasForeignKey(u=>u.LikerId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
                 .HasMany(m => m.MessageSent)
                 .WithOne(u => u.Sender)
                 .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
                .HasMany(m=>m.MessageReceived)
                .WithOne(u=>u.Recipient)
                .OnDelete(DeleteBehavior.Restrict);


        }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> messages { get; set; }
    }
}
