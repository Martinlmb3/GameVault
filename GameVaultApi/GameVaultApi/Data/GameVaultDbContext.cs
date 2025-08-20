using Microsoft.EntityFrameworkCore;
using GameVaultApi.Entities;

namespace GameVaultApi.Data
{
    public class GameVaultDbContext : DbContext
    {
        public GameVaultDbContext(DbContextOptions<GameVaultDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Game> Games => Set<Game>();
        public DbSet<Genre> Genres => Set<Genre>();
        public DbSet<GameGenre> GameGenres => Set<GameGenre>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 🔗 Jointure Game ↔ Genre
            modelBuilder.Entity<GameGenre>()
                .HasKey(gg => new { gg.GameId, gg.GenreId });

            modelBuilder.Entity<GameGenre>()
                .HasOne(gg => gg.Game)
                .WithMany(g => g.GameGenres)
                .HasForeignKey(gg => gg.GameId);

            modelBuilder.Entity<GameGenre>()
                .HasOne(gg => gg.Genre)
                .WithMany(g => g.GameGenres)
                .HasForeignKey(gg => gg.GenreId);

            // 🔗 Relation User ↔ Game
            modelBuilder.Entity<Game>()
                .HasOne(g => g.User)
                .WithMany(u => u.Games)
                .HasForeignKey(g => g.UserId);
        }
    }
}