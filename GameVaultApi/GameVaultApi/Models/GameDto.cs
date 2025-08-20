namespace GameVaultApi.Models
{
    public class GameDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> Genres { get; set; } = new List<string>();
    }

}