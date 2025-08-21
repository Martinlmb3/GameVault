using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameVaultApi.Entities;
using GameVaultApi.Models;
using GameVaultApi.Services;
using System.Security.Claims;

namespace GameVaultApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GameController(IGameService gameService) : ControllerBase
    {

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Game>>> GetAllGames()
        {
            var games = await gameService.GetAllGamesAsync();
            return Ok(games);
        }

        [HttpGet("my-games")]
        public async Task<ActionResult<IEnumerable<Game>>> GetMyGames()
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
                return Unauthorized("Invalid user token.");
            
            var games = await gameService.GetUserGamesAsync(userId);
            return Ok(games);
        }
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<Game>> GetGame(Guid id)
        {
            var game = await gameService.GetGameByIdAsync(id);
            if (game == null)
            {
                return NotFound("Game not found.");
            }
            return Ok(game);
        }

        [HttpPost]
        public async Task<ActionResult<Game>> CreateGame(GameDto gameDto)
        {
            if(gameDto is null)
            {
                return BadRequest("Game data is null.");
            }
            
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
                return Unauthorized("Invalid user token.");
            
            var game = await gameService.CreateGameAsync(gameDto, userId);
            if (game == null)
                return BadRequest("Failed to create game.");
                
            return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
        }
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Game>> UpdateGame(Guid id, GameDto gameDto)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
                return Unauthorized("Invalid user token.");
                
            var game = await gameService.UpdateGameAsync(id, gameDto, userId);
            if (game == null)
            {
                return NotFound("Game not found or you don't have permission to update it.");
            }
            
            return Ok(game);
        }
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> DeleteGame(Guid id)
        {
            var userId = GetCurrentUserId();
            if (userId == Guid.Empty)
                return Unauthorized("Invalid user token.");
                
            var success = await gameService.DeleteGameAsync(id, userId);
            if (!success)
            {
                return NotFound("Game not found or you don't have permission to delete it.");
            }
            
            return NoContent();
        }
        
        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Guid.Empty;
            return userId;
        }
    }
}
