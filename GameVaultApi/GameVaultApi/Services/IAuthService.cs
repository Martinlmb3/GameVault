using GameVaultApi.Entities;
using GameVaultApi.Models;


namespace GameVaultApi.Services
{
    public interface IAuthService
    {
        Task<RegisterResponseWithTokenDto?> RegisterAsync(RegisterDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(Guid userId);
        Task<ProfileResponseDto?> GetUserProfileAsync(Guid userId);
        Task<ProfileResponseDto?> UpdateUserProfileAsync(Guid userId, ProfileDto request);
    }
}
