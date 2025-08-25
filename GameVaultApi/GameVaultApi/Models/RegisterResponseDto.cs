namespace GameVaultApi.Models
{
    public class RegisterResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public string? Image { get; set; } = string.Empty;
    }
}