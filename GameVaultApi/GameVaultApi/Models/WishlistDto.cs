namespace GameVaultApi.Models
{
    public class WishlistDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid GameId { get; set; }
        public DateTime AddedAt { get; set; }
    }

    public class WishlistCreateDto
    {
        public Guid GameId { get; set; }
    }

    public class WishlistWithGameDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid GameId { get; set; }
        public DateTime AddedAt { get; set; }
        public GameDto Game { get; set; } = null!;
    }

    public class WishlistResponseDto
    {
        public Guid Id { get; set; }
        public GameDto Game { get; set; } = null!;
        public DateTime AddedAt { get; set; }
    }
}