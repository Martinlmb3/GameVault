using GameVaultApi.Data;
using GameVaultApi.Entities;
using GameVaultApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GameVaultApi.Services
{
    public class GameService(GameVaultDbContext context) : IGameService
    {
        public async Task<Game?> CreateGameAsync(GameDto gameDto, Guid userId)
        {
            var game = new Game
            {
                Id = Guid.NewGuid(),
                Name = gameDto.Title,
                Publisher = gameDto.Publisher ?? string.Empty,
                Platform = gameDto.Platform ?? string.Empty,
                Image = gameDto.Image ?? string.Empty,
                ReleaseDate = gameDto.ReleaseDate ?? DateTime.UtcNow,
                UserId = userId
            };

            context.Games.Add(game);

            // Handle genres
            if (gameDto.Genres != null && gameDto.Genres.Count > 0)
            {
                foreach (var genreName in gameDto.Genres)
                {
                    // Find or create genre
                    var genre = await context.Genres.FirstOrDefaultAsync(g => g.Name == genreName);
                    if (genre == null)
                    {
                        genre = new Genre
                        {
                            Id = Guid.NewGuid(),
                            Name = genreName
                        };
                        context.Genres.Add(genre);
                        await context.SaveChangesAsync();
                    }

                    // Create the GameGenre relationship
                    var gameGenre = new GameGenre
                    {
                        GameId = game.Id,
                        GenreId = genre.Id
                    };
                    context.GameGenres.Add(gameGenre);
                }
            }

            await context.SaveChangesAsync();
            
            // Return the game with genres loaded
            return await GetGameByIdAsync(game.Id);
        }

        public async Task<Game?> GetGameByIdAsync(Guid gameId)
        {
            return await context.Games
                .Include(g => g.GameGenres)
                    .ThenInclude(gg => gg.Genre)
                .Include(g => g.User)
                .FirstOrDefaultAsync(g => g.Id == gameId);
        }

        public async Task<Game?> UpdateGameAsync(Guid gameId, GameDto gameDto, Guid userId)
        {
            var game = await context.Games.FirstOrDefaultAsync(g => g.Id == gameId && g.UserId == userId);
            if (game == null)
                return null;

            game.Name = gameDto.Title;
            game.Publisher = gameDto.Publisher ?? game.Publisher;
            game.Platform = gameDto.Platform ?? game.Platform;
            game.Image = gameDto.Image ?? game.Image;
            game.ReleaseDate = gameDto.ReleaseDate ?? game.ReleaseDate;

            await context.SaveChangesAsync();
            return game;
        }

        public async Task<bool> DeleteGameAsync(Guid gameId, Guid userId)
        {
            var game = await context.Games.FirstOrDefaultAsync(g => g.Id == gameId && g.UserId == userId);
            if (game == null)
                return false;

            context.Games.Remove(game);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Game>> GetUserGamesAsync(Guid userId)
        {
            return await context.Games
                .Where(g => g.UserId == userId)
                .Include(g => g.GameGenres)
                    .ThenInclude(gg => gg.Genre)
                .ToListAsync();
        }

        public async Task<IEnumerable<Game>> GetAllGamesAsync()
        {
            return await context.Games
                .Include(g => g.GameGenres)
                    .ThenInclude(gg => gg.Genre)
                .Include(g => g.User)
                .ToListAsync();
        }
    }
}