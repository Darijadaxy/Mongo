
using WebTemplate.DTOs;
public interface ITripService
{
    Task<Trip> CreateAsync(CreateTripDTO dto);
    Task<List<Trip>> GetAllAsync();
    Task<Trip?> GetByIdAsync(string id);
    Task<bool> UpdateAsync(string id, UpdateTripDTO dto);
    Task<bool> DeleteAsync(string id);
    Task<List<Trip>> GetAvailableAsync();
    Task<bool> ChangeStatusAsync(string tripId, TripStatus newStatus);
    Task<TripDetailsDTO?> GetDetailsAsync(string id);
    Task<bool> AddReviewAsync(string tripId, CreateReviewDTO dto);
    Task<List<ReviewInfoDTO>> GetReviewsAsync(string tripId);
    Task<List<TripDetailsDTO>> FilterAsync(TripFilterDTO filterDTO);
    Task<List<TripDetailsDTO>> SearchAsync(string searchTerm);
}