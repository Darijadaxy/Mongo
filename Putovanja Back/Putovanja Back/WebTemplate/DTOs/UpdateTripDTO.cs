namespace WebTemplate.DTOs
{
    public class UpdateTripDTO
    {
        public string? Name { get; set; }
        public List<string>? DestinationIds { get; set; }
        public int? Price { get; set; }
        public string? Description { get; set; }
        public List<DateRange>? AvailableDates { get; set; }
        public TripStatus? Status { get; set; }
        public TripVehicle? Vehicle { get; set; }
        public string? Picture { get; set; }
    }
}
