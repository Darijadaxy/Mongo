namespace WebTemplate.DTOs;
public class CreateDestinationDTO
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public List<string>? Images { get; set; } = new();
}