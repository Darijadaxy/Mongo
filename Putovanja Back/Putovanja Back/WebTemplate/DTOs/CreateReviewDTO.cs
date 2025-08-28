namespace WebTemplate.DTOs;

public class CreateReviewDTO
{
    public string? Text { get; set; }
    public required int Rating { get; set; }
}