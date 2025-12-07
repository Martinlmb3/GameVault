namespace GameVaultApi.Models
{
    public class ProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Image { get; set; } = string.Empty;
    }

    public class UpdateProfileDto
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Image { get; set; }
        public string? Bio { get; set; }
    }

    public class ProfileResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Image { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public DateTimeOffset CreateAt { get; set; }
    }
}