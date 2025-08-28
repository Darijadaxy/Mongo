using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
public class DestinationInfo
{
    [BsonRepresentation(BsonType.ObjectId)]
    public required string Id { get; set; }
    public string? Name { get; set; }
}