using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class Trip
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public required string Name { get; set; }

    public required List<DestinationInfo> Destinations { get; set; } = new();

    public required int Price { get; set; }

    [BsonIgnoreIfDefault]
    public List<Review>? Reviews { get; set; }

    [BsonIgnoreIfDefault]
    public double? AverageRating { get; set; }

    public required string Description { get; set; }

    public List<DateRange>? AvailableDates { get; set; } = new();

    [BsonRepresentation(BsonType.String)]
    public required TripStatus Status { get; set; }

    [BsonRepresentation(BsonType.String)]

    public required TripVehicle Vehicle { get; set; }

    [BsonIgnoreIfDefault]
    public string? Picture { get; set; }

}