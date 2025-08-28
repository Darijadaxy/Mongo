using WebTemplate.DTOs;
public interface IReservationService
{
    Task<List<ReservationDTO>> GetAllReservations();

    Task<ReservationWithTripDTO?> GetReservation(string id);

    Task<List<ReservationWithTripDTO>> GetUserReservations(string userId);
    Task<List<ReservationWithTripDTO>> GetUserReservations();
    Task<List<ReservationDTO>> GetTripReservations(string tripId);

    Task<Reservation?> AddReservation(CreateReservationDTO reservationdto);

    Task<bool> UpdateReservation(string id, UpdateReservationDTO reservationdto);

    Task<bool> DeleteReservation(string id);

    Task<bool> UpdateReservationStatus(string id, ReservationStatus status);

}
