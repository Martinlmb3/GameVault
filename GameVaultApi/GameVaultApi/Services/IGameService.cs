using GameVaultApi.Entities;
using GameVaultApi.Models;

namespace GameVaultApi.Services
{
    public interface IGameService
    {
        Task<Game?> CreateGameAsync(GameDto gameDto, Guid userId);
        Task<Game?> GetGameByIdAsync(Guid gameId);
        Task<Game?> UpdateGameAsync(Guid gameId, GameDto gameDto, Guid userId);
        Task<bool> DeleteGameAsync(Guid gameId, Guid userId);
        Task<IEnumerable<Game>> GetUserGamesAsync(Guid userId);
        Task<IEnumerable<Game>> GetAllGamesAsync();
    }
}