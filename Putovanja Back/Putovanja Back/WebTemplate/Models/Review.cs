using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class Review
{
    [BsonRepresentation(BsonType.ObjectId)]
    public required string UserId { get; set; }
    public string? Text { get; set; }
    public required int Rating { get; set; }
}