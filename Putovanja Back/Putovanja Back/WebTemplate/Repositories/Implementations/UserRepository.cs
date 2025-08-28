using MongoDB.Driver;
public class UserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _userCollection;

    public UserRepository(IMongoDatabase database)
    {
        _userCollection = database.GetCollection<User>("users");
    }
    public async Task<DeleteResult> DeleteAsync(string id)
    {
        return await _userCollection
            .DeleteOneAsync(d => d.Id == id);
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _userCollection
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        return await _userCollection
            .Find(d => d.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task InsertAsync(User user)
    {
        await _userCollection
            .InsertOneAsync(user);
    }

    public async Task<UpdateResult> UpdateAsync(string id, UpdateDefinition<User> update)
    {
        return await _userCollection
             .UpdateOneAsync(d => d.Id == id, update);
    }


    public async Task<User?> FindByUsernameOrEmailAsync(string username, string email)
    {
        return await _userCollection
                .Find(u => u.Username == username || u.Email == email)
                .FirstOrDefaultAsync();
    }
    public async Task<bool> SaveTrip(string userId, string tripId)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
        var update = Builders<User>.Update.AddToSet(u => u.SavedTrips, tripId);
        var result = await _userCollection.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;

    }
    public async Task<List<string>> GetSavedTrips(string userId)
    {
        var user = await _userCollection.Find(u => u.Id == userId).FirstOrDefaultAsync();
        return user.SavedTrips;
    }
    
    public async Task<User?> FindByUsernameAsync(string username) 
    {
        return await _userCollection
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync();
    }

}

