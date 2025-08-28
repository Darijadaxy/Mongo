namespace WebTemplate.DTOs
{
    public class SavedTripDTO
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required int Price { get; set; }
        public required TripVehicle Vehicle { get; set; }
        public string? Picture { get; set; }
        public List<DateRange>? AvailableDates { get; set; } = new();

    }
}
