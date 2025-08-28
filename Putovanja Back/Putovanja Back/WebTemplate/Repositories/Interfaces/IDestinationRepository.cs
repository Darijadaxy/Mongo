using MongoDB.Driver;

public interface IDestinationRepository
{
    Task<List<Destination>> GetAllAsync();
    Task<Destination?> GetByIdAsync(string id);
    Task InsertAsync(Destination destination);
    Task<UpdateResult> UpdateAsync(string id, UpdateDefinition<Destination> update);
    Task<DeleteResult> DeleteAsync(string id);
}
