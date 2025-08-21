namespace GameVaultApi.Models
{
    public class RegisterResponseWithTokenDto
    {
        public RegisterResponseDto RegisterResponse { get; set; } = null!;
        public string RefreshToken { get; set; } = string.Empty;
    }
}