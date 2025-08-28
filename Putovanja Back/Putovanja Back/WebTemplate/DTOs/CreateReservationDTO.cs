namespace WebTemplate.DTOs;
public class CreateReservationDTO
{
    //public required string UserId { get; set; } - jer uzimamo iz tokena
    public required string TripId { get; set; }

    public required DateRange Date { get; set; }

    public required int NumberOfPeople { get; set; }

}