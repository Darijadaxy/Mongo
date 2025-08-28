using WebTemplate.DTOs;

public interface IDestinationService
{
    Task<List<Destination>> GetAllAsync();
    Task<Destination?> GetByIdAsync(string id);
    Task<Destination> CreateAsync(CreateDestinationDTO dto);
    Task<bool> UpdateAsync(string id, UpdateDestinationDTO dto);
    Task<bool> DeleteAsync(string id);
}