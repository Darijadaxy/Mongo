namespace WebTemplate.DTOs
{
    public class TripDetailsDTO
    {
        public string? Id { get; set; }
        public string Name { get; set; } = null!;
        public List<DestinationInfo> Destinations { get; set; } = new();
        public int Price { get; set; }
        public double? AverageRating { get; set; }
        public string Description { get; set; } = null!;
        public List<DateRange>? AvailableDates { get; set; }
        public TripStatus Status { get; set; }
        public TripVehicle Vehicle { get; set; }
        public string? Picture { get; set; }
    }
}