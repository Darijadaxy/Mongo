using MongoDB.Driver;
using WebTemplate.DTOs;
public interface ITripRepository
{
    Task<Trip> CreateAsync(Trip trip);
    Task<List<Trip>> GetAllAsync();
    Task<Trip?> GetByIdAsync(string id);
    Task<bool> UpdateAsync(Trip trip);
    Task<bool> DeleteAsync(string id);
    Task<List<Trip>> GetAvailableAsync();
    Task<UpdateResult> UpdateReviewsAndRatingAsync(string id, UpdateDefinition<Trip> update);
    Task<List<TripDetailsDTO>> FilterAsync(FilterDefinition<Trip> filter);
    Task<bool> AnyAsync(FilterDefinition<Trip> filter);
}