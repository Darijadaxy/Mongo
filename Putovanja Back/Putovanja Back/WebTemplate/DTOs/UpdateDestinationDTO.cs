namespace WebTemplate.DTOs;
public class UpdateDestinationDTO
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public List<string>? Images { get; set; } = new();
}