namespace GameVaultApi.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? Bio { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Image { get; set; } = string.Empty;
        public string? RefreshToken { get; set; } = string.Empty;
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public DateTimeOffset CreateAt { get; set; } = DateTimeOffset.UtcNow;
        
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }
}
