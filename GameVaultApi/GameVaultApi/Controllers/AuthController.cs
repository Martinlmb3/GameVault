using GameVaultApi.Entities;
using GameVaultApi.Models;
using GameVaultApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;


namespace GameVaultApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponseDto>> Register(UserDto request)
        {
            var result = await authService.RegisterAsync(request);
            if (result is null)
                return BadRequest("Email already exists.");
            
            // Set refresh token as HttpOnly cookie for security
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Use HTTPS in production
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", result.RefreshToken, cookieOptions);
            
            return Ok(result.RegisterResponse);
        }
        [Authorize]
        [HttpGet]
        public IActionResult AuthenticatedOnlyEndpoint()
        {
            return Ok("You are authenticated");
        }


        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login(UserDto request)
        {
            var result = await authService.LoginAsync(request);
            if (result is null)
                return BadRequest("Invalid email or password.");
            
            // Get user info for response
            var user = await authService.GetUserByEmailAsync(request.Email);
            if (user is null)
                return BadRequest("User not found.");
            
            // Set refresh token as HttpOnly cookie for security
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Use HTTPS in production
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", result.RefreshToken!, cookieOptions);
            
            var loginResponse = new LoginResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                AccessToken = result.AccessToken!
            };
            
            return Ok(loginResponse);
        }
        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<ActionResult<LoginResponseDto>> RefreshToken()
        {
            // Get refresh token from HttpOnly cookie
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("Refresh token not found.");
            
            // Get user ID from current JWT token
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized("Invalid user token.");
            
            var request = new RefreshTokenRequestDto
            {
                UserId = userId,
                RefreshToken = refreshToken
            };
            
            var result = await authService.RefreshTokensAsync(request);
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
                return Unauthorized("Invalid refresh token.");
            
            // Get user info for response
            var user = await authService.GetUserByIdAsync(userId);
            if (user is null)
                return Unauthorized("User not found.");
            
            // Update refresh token cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", result.RefreshToken, cookieOptions);
            
            var loginResponse = new LoginResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                AccessToken = result.AccessToken
            };
            
            return Ok(loginResponse);
        }
    }
}
