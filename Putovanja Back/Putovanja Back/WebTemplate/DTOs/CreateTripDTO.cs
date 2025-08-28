namespace WebTemplate.DTOs
{
    public class CreateTripDTO
    {
        public required string Name { get; set; }
        public List<string> DestinationIds { get; set; } = new();
        public int Price { get; set; }
        public required string Description { get; set; }
        public List<DateRange>? AvailableDates { get; set; } = new();
        public TripStatus Status { get; set; }
        public TripVehicle Vehicle { get; set; }
        public string? Picture { get; set; }
    }
}