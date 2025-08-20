using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using GameVaultApi.Data;
using GameVaultApi.Entities;

namespace GameVaultApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController(GameVaultDbContext context) : ControllerBase
    {
        private readonly GameVaultDbContext _context = context;

        [HttpGet]
        public async Task<ActionResult<List<Game>>> GetGames()
        {
            return Ok(await _context.Games.ToListAsync());
        }
        [HttpGet]
        [Route("{id:guid}")]
        public async Task<ActionResult<Game>> GetGame(Guid id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }
            return Ok(game);
        }

        [HttpPost]
        public async Task<ActionResult<Game>> AddGame(Game newGame)
        {
            if(newGame is null)
            {
                return BadRequest("Game data is null.");
            }
            _context.Games.Add(newGame);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGame), new { id = newGame.Id }, newGame);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateGame(Guid id, Game updatedGame)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }
            game.Name = updatedGame.Name;
            game.Platform = updatedGame.Platform;
            game.ReleaseDate = updatedGame.ReleaseDate;
            game.Publisher = updatedGame.Publisher;
            game.Image = updatedGame.Image;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGame(Guid id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }
             _context.Remove(game);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
