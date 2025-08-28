using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class Reservation
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public required string UserId { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public required string TripId { get; set; }

    public required DateRange Date { get; set; }

    public required int NumberOfPeople { get; set; }

    public required int TotalPrice { get; set; }

    [BsonRepresentation(BsonType.String)]
    public required ReservationStatus Status { get; set; } = ReservationStatus.Pending;

}