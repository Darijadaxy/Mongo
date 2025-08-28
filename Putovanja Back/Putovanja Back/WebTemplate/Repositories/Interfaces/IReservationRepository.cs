using MongoDB.Driver;
using WebTemplate.DTOs;
public interface IReservationRepository
{
    Task<List<Reservation>> GetAllReservations();

    Task<Reservation?> GetReservation(string id);

    Task<List<Reservation>> GetUserReservations(string userId);
    Task<List<Reservation>> GetTripReservations(string tripId);
    Task<Reservation> AddReservation(Reservation reservation);

    Task<bool> UpdateReservation(string id, Reservation reservation);

    Task<bool> DeleteReservation(string id); 

    Task<bool> UpdateReservationStatus(string id, ReservationStatus status);
}
