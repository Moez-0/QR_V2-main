using PDF2;
using PDF1;
using Newtonsoft.Json.Linq;
using MongoDB.Driver;
using MongoDB.Bson;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Cryptography;


const string connectionUri = "mongodb+srv://admin:boxup@boxup.harl3n0.mongodb.net/?retryWrites=true&w=majority&appName=boxup";
var settings = MongoClientSettings.FromConnectionString(connectionUri);
// Set the ServerApi field of the settings object to set the version of the Stable API on the client
settings.ServerApi = new ServerApi(ServerApiVersion.V1);
// Create a new client and connect to the server
var client = new MongoClient(settings);
// Send a ping to confirm a successful connection
try {
  var result = client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));
  Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");
} catch (Exception ex) {
  Console.WriteLine(ex);
  Console.WriteLine("error not conencted to mongo");
}


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000") // Replace with your React app's domain
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
}); 
var mongoClient = new MongoClient(connectionUri);
var database = mongoClient.GetDatabase("boxupDB");
builder.Services.AddSingleton(database);
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<ProductService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp"); // Enable CORS with the policy for your React app

app.MapPost("/signup", async (UserService userService, User user) =>
{
    var existingUser = await userService.GetUserByUsernameAsync(user.Username);
    if (existingUser != null)
    {
        return Results.BadRequest("Username already exists");
    }

    // Hash the user's password
    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
    user.Password = hashedPassword;

    // Create the user
    await userService.CreateUserAsync(user);

    // Generate JWT token
   var tokenHandler = new JwtSecurityTokenHandler();
    var key = new byte[32]; // 256 bits
    using (var rng = new RNGCryptoServiceProvider())
    {
        rng.GetBytes(key);
    }
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Name, user.Username)
            // You can add more claims as needed (e.g., user ID)
        }),
        Expires = DateTime.UtcNow.AddHours(1), // Token expiration time
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);

    // Return the token along with the response
    var response = new { Token = tokenString, Message = "User registered successfully" , UserData = user};
    return Results.Ok(response);
}).WithName("Signup").WithOpenApi();
app.MapPost("/login", async (UserService userService, User user) =>
{
     var tokenHandler = new JwtSecurityTokenHandler();
    var key = new byte[32]; // 256 bits
    using (var rng = new RNGCryptoServiceProvider())
    {
        rng.GetBytes(key);
    }
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.Name, user.Username)
            // You can add more claims as needed (e.g., user ID)
        }),
        Expires = DateTime.UtcNow.AddHours(1), // Token expiration time
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);
    var tokenString = tokenHandler.WriteToken(token);
    var existingUser = await userService.GetUserByUsernameAsync(user.Username);
    if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
    {
        return Results.BadRequest("Invalid username or password");
    }
     var response = new { Token = tokenString, Message = "Login successfull" , UserData = existingUser};
    return Results.Ok(response);
}).WithName("Login").WithOpenApi();
app.MapPut("/users/{username}/password", async (UserService userService, string username, ChangePasswordModel changePasswordModel) =>
{
    // Fetch the user by username
    var user = await userService.GetUserByUsernameAsync(username);
    if (user == null)
    {
        return Results.NotFound("User not found");
    }

    // Verify that the old password matches the user's current password
    
    if (!BCrypt.Net.BCrypt.Verify(changePasswordModel.OldPassword, user.Password))
    {
        return Results.BadRequest("Incorrect old password");
    }

    // Hash the new password
    string hashedNewPassword = BCrypt.Net.BCrypt.HashPassword(changePasswordModel.NewPassword);

    // Update the user's password in the database
    user.Password = hashedNewPassword;
    await userService.UpdateUserAsync(user.Id, user);

    return Results.Ok("Password updated successfully");
}).WithName("UpdatePassword").WithOpenApi();

app.MapPut("/users/{username}", async (UserService userService, string username, User updatedUser) =>
{
    // Fetch the user by username
    var existingUser = await userService.GetUserByUsernameAsync(username);
    
    if (existingUser == null)
    {
        // Return a 404 Not Found response if the user does not exist
        return Results.NotFound();
    }

    // Update the user's information
    existingUser.Username = updatedUser.Username;
    existingUser.Password = updatedUser.Password; // You might want to hash the password again
    existingUser.Email = updatedUser.Email;
    existingUser.FullName = updatedUser.FullName;
    existingUser.Address = updatedUser.Address;
    existingUser.Phone = updatedUser.Phone;

    // Call the UserService to update the user in the database
    await userService.UpdateUserByUsernameAsync(username, existingUser);

    // Return a success response
    return Results.Ok("User updated successfully");
}).WithName("UpdateUserByUsername").WithOpenApi();

app.MapPost("/products", async (ProductService productService, Product product) =>
{
    var createdProduct = await productService.CreateProductAsync(product);
    return Results.Ok(createdProduct);
}).WithName("CreateProduct").WithOpenApi();

app.MapGet("/products/{id}", async (ProductService productService, string id) =>
{
    var product = await productService.GetProductByIdAsync(id);
    if (product == null)
    {
        return Results.NotFound();
    }
    return Results.Ok(product);
}).WithName("GetProductById").WithOpenApi();

app.MapGet("/products", async (ProductService productService) =>
{
    var products = await productService.GetAllProductsAsync();
    return Results.Ok(products);
}).WithName("GetAllProducts").WithOpenApi();

app.MapPut("/products/{id}", async (ProductService productService, string id, Product product) =>
{
    await productService.UpdateProductAsync(id, product);
    return Results.NoContent();
}).WithName("UpdateProduct").WithOpenApi();

app.MapDelete("/products/{id}", async (ProductService productService, string id) =>
{
    await productService.DeleteProductAsync(id);
    return Results.NoContent();
}).WithName("DeleteProduct").WithOpenApi();

app.MapGet("/products/user", async (ProductService productService, string userId) =>
{
    var products = await productService.GetProductsByUserIdAsync(userId);


    return Results.Ok(products);
}).WithName("GetProductsByUserId").WithOpenApi();


JArray dataArray = null;
app.MapPost("/excelData", async (HttpRequest request) =>
{
    using (StreamReader reader = new StreamReader(request.Body))
    {
        string jsonString = await reader.ReadToEndAsync();
        JObject jsonData = JObject.Parse(jsonString);
        string type = jsonData["type"].ToString();

        Console.WriteLine(type);
        Console.WriteLine(jsonString);
        // Handle JSON data here
        // Example: Extract data from JSON object
        int nbRows = 4;
        int nbCols = 12;
       dataArray = (JArray)jsonData["dataArray"];
        if (type == "A5"){
            if (dataArray != null){
             var pdf = new Generate65PDF1(210, 297,4,12,1,1,1,1,8,true,"center","128","barcodeSimple",dataArray);
             }else{
                return Results.BadRequest("Failed to read PDF file. Please try again later.");
             }
        }else{
            if (dataArray != null){
                var pdf = new Generate24PDF1(37,70,3,12,1,1,1,1,8,true,"center","128","barcodeSimple",dataArray);
            }else{
                return Results.BadRequest("Failed to read PDF file. Please try again later.");
            }
        }
        
    }

    // Return your response, if needed
    return Results.Ok("Excel data received successfully");
}).WithRequestTimeout(TimeSpan.FromSeconds(5))
.WithName("ExcelData")
.WithOpenApi();

app.MapPost("/params", (string paperWidth, string paperHeight,string nbRows,string nbCols,string pageTopMargin,string pageBottomMargin,string pageLeftMargin,string pageRightMargin,string type,string titleAlign,string titleSize,string titleBold,string barcodeType,string design) =>
{
   Console.WriteLine(design);
    
    // Convert paperWidth and paperHeight to integers
    int width = Convert.ToInt32(paperWidth);
    int height = Convert.ToInt32(paperHeight);
    int rows = Convert.ToInt32(nbRows);
    int cols = Convert.ToInt32(nbCols) * 3 +1 ;
    int bottomMargin = Convert.ToInt32(pageBottomMargin);
    int topMargin = Convert.ToInt32(pageTopMargin);
    int leftMargin = Convert.ToInt32(pageLeftMargin);
    int rightMargin = Convert.ToInt32(pageRightMargin);
    int tSize = Convert.ToInt32(titleSize);
    bool tBold = Convert.ToBoolean(titleBold);
    string tAlign = titleAlign;

    
    var filePath = "";
    if(type == "A5"){
    // Generate PDF with the specified width and height
        if(dataArray != null){
            var pdf = new Generate65PDF1(width, height,rows,cols,bottomMargin,topMargin,leftMargin,rightMargin,tSize,tBold,tAlign,barcodeType,design,dataArray);
    
        }else{
            return Results.BadRequest("Failed to read PDF file. Please try again later.");
        }
        filePath = "65pdf.pdf"; // Path to the generated PDF file
    }else{
        if(dataArray!=null){
            var pdf = new Generate24PDF1(width,height,3,12,bottomMargin,topMargin,leftMargin,rightMargin,tSize,tBold,tAlign,barcodeType,design,dataArray);
        }else{
            return Results.BadRequest("Failed to read PDF file. Please try again later.");
        }
        filePath = "24pdf.pdf"; // Path to the generated PDF file
    }
   
    byte[] fileBytes;
    try
    {
        // Attempt to read the file into a byte array
        fileBytes = System.IO.File.ReadAllBytes(filePath);
    }
    catch (System.IO.IOException ex)
    {
        // Handle the exception here, for example, log it
        Console.WriteLine($"Failed to read PDF file: {ex.Message}");
        // Return an appropriate response indicating the failure
        return Results.BadRequest("Failed to read PDF file. Please try again later.");
    }
    
    // Return the file as a response with the appropriate content type
    return Results.File(fileBytes, "application/pdf", filePath);
}).WithRequestTimeout(TimeSpan.FromSeconds(5))
.WithName("PostParams")
.WithOpenApi();
app.MapGet("/generate65", () =>
{       
    var filePath = "65pdf.pdf"; // Path to the generated PDF file
    byte[] fileBytes;
    try
    {
        // Attempt to read the file into a byte array
        fileBytes = System.IO.File.ReadAllBytes(filePath);
    }
    catch (System.IO.IOException ex)
    {
        // Handle the exception here, for example, log it
        Console.WriteLine($"Failed to read PDF file: {ex.Message}");
        // Return an appropriate response indicating the failure
        return Results.BadRequest("Failed to read PDF file. Please try again later.");
    }

    // Return the file as a response with the appropriate content type
    return Results.File(fileBytes, "application/pdf", "65pdf.pdf");
})
.WithRequestTimeout(TimeSpan.FromSeconds(5))
.WithName("GetPDF65")
.WithOpenApi();
app.MapGet("/generate24", () => 
{       
  
   var filePath = "24pdf.pdf"; // Path to the generated PDF file
    byte[] fileBytes;
    try
    {
        // Attempt to read the file into a byte array
        fileBytes = System.IO.File.ReadAllBytes(filePath);
    }
    catch (System.IO.IOException ex)
    {
        // Handle the exception here, for example, log it
        Console.WriteLine($"Failed to read PDF file: {ex.Message}");
        // Return an appropriate response indicating the failure
        return Results.BadRequest("Failed to read PDF file. Please try again later.");
    }

    // Return the file as a response with the appropriate content type
    return Results.File(fileBytes, "application/pdf", "24pdf.pdf");
})
.WithName("GetPDF24")
.WithOpenApi();

app.Run();
