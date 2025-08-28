using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string PhoneNumber { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> SavedTrips { get; set; } = new();

    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> Reservations { get; set; } = new();
}