using MongoDB.Driver;
using WebTemplate.DTOs;
public class ReservationRepository : IReservationRepository
{
    private readonly IMongoCollection<Reservation> _reservationCollection;

    public ReservationRepository(IMongoDatabase database)
    {
        _reservationCollection = database.GetCollection<Reservation>("reservations");
    }

    public async Task<Reservation> AddReservation(Reservation reservation)
    {
        await _reservationCollection.InsertOneAsync(reservation);
        return reservation;
    }

    public async Task<bool> DeleteReservation(string id)
    {
        var result = await _reservationCollection.DeleteOneAsync(r => r.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<List<Reservation>> GetAllReservations()
    {
        return await _reservationCollection
          .Find(_ => true)
          .ToListAsync();
    }

    public async Task<Reservation?> GetReservation(string id)
    {
        return await _reservationCollection
           .Find(d => d.Id == id)
           .FirstOrDefaultAsync();
    }

    public async Task<List<Reservation>> GetUserReservations(string userId)
    {
        return await _reservationCollection
          .Find(r => r.UserId == userId)
          .ToListAsync();
    }

    public async Task<List<Reservation>> GetTripReservations(string tripId)
    {
        return await _reservationCollection
          .Find(r => r.TripId == tripId)
          .ToListAsync();
    }

    public async Task<bool> UpdateReservation(string id, Reservation reservation)
    {
        var result = await _reservationCollection.ReplaceOneAsync(r => r.Id == reservation.Id, reservation);
        return result.ModifiedCount > 0;
    }
    public async Task<bool> UpdateReservationStatus(string id, ReservationStatus status)
    {
        var filter = Builders<Reservation>.Filter.Eq(r => r.Id, id);
        var update = Builders<Reservation>.Update.Set("Status", status);
        var result = await _reservationCollection.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

}