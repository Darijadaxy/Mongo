namespace WebTemplate.DTOs;

public class UserInfoDTO
{
    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public bool? isAdmin { get; set; } = null!;
}