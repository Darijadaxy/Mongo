using MongoDB.Driver;

public interface IUserRepository
{
  Task<List<User>> GetAllAsync();
  Task<User?> GetByIdAsync(string id);
  Task InsertAsync(User user);
  Task<UpdateResult> UpdateAsync(string id, UpdateDefinition<User> update);
  Task<DeleteResult> DeleteAsync(string id);
  Task<User?> FindByUsernameOrEmailAsync(string username, string email);
  Task<bool> SaveTrip(string userId, string tripId);
  Task<List<string>> GetSavedTrips(string userId);
  Task<User?> FindByUsernameAsync(string username);
}
