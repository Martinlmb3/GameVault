namespace GameVaultApi.Models
{
    public class LoginResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
    }
}