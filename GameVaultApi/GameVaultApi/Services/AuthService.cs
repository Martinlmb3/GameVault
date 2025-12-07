using GameVaultApi.Data;
using GameVaultApi.Entities;
using GameVaultApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace GameVaultApi.Services
{
    public class AuthService(GameVaultDbContext context, IConfiguration configuration) : IAuthService
    {
        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };
            var key = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        public async Task<TokenResponseDto> LoginAsync(UserDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user is null)
            {
                return null;
            }
            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
            {
                return null;
            }
            TokenResponseDto response = await CreateTokenResponse(user);
            return response;
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
            };
        }

        public async Task<RegisterResponseWithTokenDto?> RegisterAsync(RegisterDto request)
        {
            if (await context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return null;
            }
            var user = new User();
            var hashedPassword = new PasswordHasher<User>().HashPassword(user, request.Password);
            user.Username = request.Username;
            user.Email = request.Email;
            user.PasswordHash = hashedPassword;
            user.Image = "/logo.png"; // Default image for new users
            
            // Generate and save refresh token
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            
            context.Users.Add(user);
            await context.SaveChangesAsync();
            
            // Create response with access token and refresh token
            var registerResponse = new RegisterResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                AccessToken = CreateToken(user),
                Image = user.Image
            };
            
            return new RegisterResponseWithTokenDto
            {
                RegisterResponse = registerResponse,
                RefreshToken = refreshToken
            };
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return refreshToken;

        }

        private async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null || user.RefreshToken != refreshToken
            || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                return null;
            return user;
        }

        public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
            if (user is null)
                return null;
            return await CreateTokenResponse(user);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByIdAsync(Guid userId)
        {
            return await context.Users.FindAsync(userId);
        }

        public async Task<ProfileResponseDto?> GetUserProfileAsync(Guid userId)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null)
                return null;

            return new ProfileResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Image = user.Image,
                Bio = user.Bio,
                CreateAt = user.CreateAt
            };
        }

        public async Task<ProfileResponseDto?> UpdateUserProfileAsync(Guid userId, ProfileDto request)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null)
                return null;

            // Check if email is already taken by another user
            if (request.Email != user.Email && await context.Users.AnyAsync(u => u.Email == request.Email && u.Id != userId))
                return null;

            // Update user properties
            user.Username = request.Username;
            user.Email = request.Email;
            if (!string.IsNullOrEmpty(request.Image))
                user.Image = request.Image;

            await context.SaveChangesAsync();

            return new ProfileResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Image = user.Image,
                Bio = user.Bio,
                CreateAt = user.CreateAt
            };
        }

        public async Task<ProfileResponseDto?> UpdateUserProfilePatchAsync(Guid userId, UpdateProfileDto request)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null)
                return null;

            // Update email if provided and not empty
            if (!string.IsNullOrEmpty(request.Email))
            {
                // Check if email is already taken by another user
                if (request.Email != user.Email && await context.Users.AnyAsync(u => u.Email == request.Email && u.Id != userId))
                    return null;

                user.Email = request.Email;
            }

            // Update username if provided and not empty
            if (!string.IsNullOrEmpty(request.Username))
            {
                user.Username = request.Username;
            }

            // Update image if provided (can be empty string to clear it)
            if (request.Image is not null)
            {
                user.Image = request.Image;
            }

            // Update bio if provided (can be empty string to clear it)
            if (request.Bio is not null)
            {
                user.Bio = request.Bio;
            }

            await context.SaveChangesAsync();

            return new ProfileResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Image = user.Image,
                Bio = user.Bio,
                CreateAt = user.CreateAt
            };
        }
    }


}
