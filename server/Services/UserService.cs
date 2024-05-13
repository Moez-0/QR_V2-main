using MongoDB.Driver;
using System.Threading.Tasks;

public class UserService
{
    private readonly IMongoCollection<User> _collection;

    public UserService(IMongoDatabase database)
    {
        _collection = database.GetCollection<User>("Users");
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        return await _collection.Find(u => u.Username == username).FirstOrDefaultAsync();
    }

    public async Task CreateUserAsync(User user)
    {
        await _collection.InsertOneAsync(user);
    }
     public async Task UpdateUserByUsernameAsync(string username, User updatedUser)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Username, username);
        var update = Builders<User>.Update
            .Set(u => u.Username, updatedUser.Username)
            .Set(u => u.Password, updatedUser.Password) // You might want to hash the password again
            .Set(u => u.Email, updatedUser.Email)
            .Set(u => u.FullName, updatedUser.FullName)
            .Set(u => u.Address, updatedUser.Address)
            .Set(u => u.Phone, updatedUser.Phone);

        await _collection.UpdateOneAsync(filter, update);
    }
    public async Task UpdateUserAsync(string userId, User updatedUser)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, userId);
        var update = Builders<User>.Update
            .Set(u => u.Username, updatedUser.Username)
            .Set(u => u.Password, updatedUser.Password) // You might want to hash the password again
            .Set(u => u.Email, updatedUser.Email)
            .Set(u => u.FullName, updatedUser.FullName)
            .Set(u => u.Address, updatedUser.Address)
            .Set(u => u.Phone, updatedUser.Phone);

        await _collection.UpdateOneAsync(filter, update);
    }
}
