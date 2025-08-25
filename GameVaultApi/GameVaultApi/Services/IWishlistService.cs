using GameVaultApi.Models;

namespace GameVaultApi.Services
{
    public interface IWishlistService
    {
        Task<List<WishlistResponseDto>> GetUserWishlistAsync(Guid userId);
        Task<WishlistDto> AddToWishlistAsync(Guid userId, WishlistCreateDto wishlistCreateDto);
        Task<bool> RemoveFromWishlistAsync(Guid userId, Guid gameId);
        Task<bool> IsGameInWishlistAsync(Guid userId, Guid gameId);
    }
}