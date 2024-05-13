using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }

    public string FullName { get; set; }

    public string Address { get; set; }

    public string Phone { get; set; }


}

public class ChangePasswordModel
{
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}