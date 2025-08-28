namespace WebTemplate.DTOs;

public class TripFilterDTO
{
    public int? MinPrice { get; set; }
    public int? MaxPrice { get; set; }
    public double? MinRating { get; set; }
    public TripVehicle? Vehicle { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}