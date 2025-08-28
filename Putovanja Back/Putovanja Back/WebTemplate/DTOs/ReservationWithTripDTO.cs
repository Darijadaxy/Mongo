public class ReservationWithTripDTO
{
    public required string Id { get; set; }
    public required string UserId { get; set; }
    public required  string TripId { get; set; }
    public required string TripName { get; set; } 
    public required DateRange Date { get; set; }
    public required int NumberOfPeople { get; set; }
    public required int TotalPrice { get; set; }
    public required ReservationStatus  Status { get; set; }
}