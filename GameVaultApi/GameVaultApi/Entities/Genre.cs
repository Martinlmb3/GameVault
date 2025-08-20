namespace GameVaultApi.Entities
{
    public class Genre
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<GameGenre> GameGenres { get; set; } = new List<GameGenre>();
    }
}
