using MongoDB.Driver;

public class DestinationRepository : IDestinationRepository
{
    private readonly IMongoCollection<Destination> _destinationCollection;

    public DestinationRepository(IMongoDatabase database)
    {
        _destinationCollection = database.GetCollection<Destination>("destinations");
    }

    public async Task<List<Destination>> GetAllAsync()
    {
        return await _destinationCollection
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task<Destination?> GetByIdAsync(string id)
    {
        return await _destinationCollection
            .Find(d => d.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task InsertAsync(Destination destination)
    {
        await _destinationCollection
            .InsertOneAsync(destination);
    }

    public async Task<UpdateResult> UpdateAsync(string id, UpdateDefinition<Destination> update)
    {
        return await _destinationCollection
            .UpdateOneAsync(d => d.Id == id, update);
    }

    public async Task<DeleteResult> DeleteAsync(string id)
    {
        return await _destinationCollection
            .DeleteOneAsync(d => d.Id == id);
    }

}