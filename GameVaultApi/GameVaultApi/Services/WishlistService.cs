using GameVaultApi.Data;
using GameVaultApi.Entities;
using GameVaultApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GameVaultApi.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly GameVaultDbContext _context;

        public WishlistService(GameVaultDbContext context)
        {
            _context = context;
        }

        public async Task<List<WishlistResponseDto>> GetUserWishlistAsync(Guid userId)
        {
            var wishlistItems = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Game)
                    .ThenInclude(g => g.GameGenres)
                        .ThenInclude(gg => gg.Genre)
                .OrderByDescending(w => w.AddedAt)
                .Select(w => new WishlistResponseDto
                {
                    Id = w.Id,
                    AddedAt = w.AddedAt,
                    Game = new GameDto
                    {
                        Id = w.Game.Id,
                        Title = w.Game.Name,
                        Publisher = w.Game.Publisher,
                        Platform = w.Game.Platform,
                        Image = w.Game.Image,
                        ReleaseDate = w.Game.ReleaseDate,
                        Genres = w.Game.GameGenres.Select(gg => gg.Genre.Name).ToList()
                    }
                })
                .ToListAsync();

            return wishlistItems;
        }

        public async Task<WishlistDto> AddToWishlistAsync(Guid userId, WishlistCreateDto wishlistCreateDto)
        {
            // Check if the game exists
            var gameExists = await _context.Games.AnyAsync(g => g.Id == wishlistCreateDto.GameId);
            if (!gameExists)
            {
                throw new ArgumentException("Game not found");
            }

            // Check if the item is already in wishlist
            var existingWishlistItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.GameId == wishlistCreateDto.GameId);

            if (existingWishlistItem != null)
            {
                throw new InvalidOperationException("Game is already in wishlist");
            }

            var wishlistItem = new Wishlist
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                GameId = wishlistCreateDto.GameId,
                AddedAt = DateTime.UtcNow
            };

            _context.Wishlists.Add(wishlistItem);
            await _context.SaveChangesAsync();

            return new WishlistDto
            {
                Id = wishlistItem.Id,
                UserId = wishlistItem.UserId,
                GameId = wishlistItem.GameId,
                AddedAt = wishlistItem.AddedAt
            };
        }

        public async Task<bool> RemoveFromWishlistAsync(Guid userId, Guid gameId)
        {
            var wishlistItem = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.GameId == gameId);

            if (wishlistItem == null)
            {
                return false;
            }

            _context.Wishlists.Remove(wishlistItem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> IsGameInWishlistAsync(Guid userId, Guid gameId)
        {
            return await _context.Wishlists
                .AnyAsync(w => w.UserId == userId && w.GameId == gameId);
        }
    }
}