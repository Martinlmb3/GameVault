using GameVaultApi.Entities;

namespace GameVaultApi.Entities
{
    public class Game
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<GameGenre> GameGenres { get; set; } = new List<GameGenre>();
    }
}