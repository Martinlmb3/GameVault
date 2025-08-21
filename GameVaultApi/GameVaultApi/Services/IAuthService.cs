using GameVaultApi.Entities;
using GameVaultApi.Models;


namespace GameVaultApi.Services
{
    public interface IAuthService
    {
        Task<RegisterResponseWithTokenDto?> RegisterAsync(UserDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(Guid userId);
    }
}
