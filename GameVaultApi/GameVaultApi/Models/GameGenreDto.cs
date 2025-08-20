namespace GameVaultApi.Models
{
    public class GameGenreDto
    {
        
        public string Title { get; set; } = string.Empty;

        public List<Guid> GenreIds { get; set; } = new List<Guid>();
    }

}
