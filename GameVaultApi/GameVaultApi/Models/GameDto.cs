namespace GameVaultApi.Models
{
    public class GameDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Publisher { get; set; }
        public string? Platform { get; set; }
        public string? Image { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public List<string> Genres { get; set; } = new List<string>();
    }

}