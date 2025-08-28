using MongoDB.Driver;
using WebTemplate.DTOs;

public class TripRepository : ITripRepository
{
    private readonly IMongoCollection<Trip> _tripCollection;
    private readonly IMongoCollection<Reservation> _reservationCollection;

    public TripRepository(IMongoDatabase database)
    {
        _tripCollection = database.GetCollection<Trip>("trips");
        _reservationCollection = database.GetCollection<Reservation>("reservations");
    }

    public async Task<Trip> CreateAsync(Trip trip)
    {
        await _tripCollection.InsertOneAsync(trip);
        return trip;
    }

    public async Task<List<Trip>> GetAllAsync()
    {
        return await _tripCollection.Find(_ => true).ToListAsync();
    }

    public async Task<Trip?> GetByIdAsync(string id)
    {
        return await _tripCollection.Find(t => t.Id == id).FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateAsync(Trip trip)
    {
        var result = await _tripCollection.ReplaceOneAsync(t => t.Id == trip.Id, trip);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var hasReservations = await _reservationCollection
            .Find(r => r.TripId == id)
            .AnyAsync();

        if (hasReservations)
        {
            return false;
        }

        var result = await _tripCollection.DeleteOneAsync(t => t.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<List<Trip>> GetAvailableAsync()
    {
        return await _tripCollection
            .Find(t => t.Status == TripStatus.Available)
            .ToListAsync();
    }
    public async Task<UpdateResult> UpdateReviewsAndRatingAsync(string id, UpdateDefinition<Trip> update)
    {
        return await _tripCollection
             .UpdateOneAsync(d => d.Id == id, update);
    }

    public async Task<List<TripDetailsDTO>> FilterAsync(FilterDefinition<Trip> filter)
    {
        return await _tripCollection
            .Find(filter)
            .Project(t => new TripDetailsDTO
            {
                Id = t.Id,
                Name = t.Name,
                Destinations = t.Destinations,
                Price = t.Price,
                AverageRating = t.AverageRating,
                Vehicle = t.Vehicle,
                Description = t.Description,
                AvailableDates = t.AvailableDates,
                Picture = t.Picture
            })
            .ToListAsync();
    }

    public async Task<bool> AnyAsync(FilterDefinition<Trip> filter)
    {
        return await _tripCollection.Find(filter).AnyAsync();
    }

}