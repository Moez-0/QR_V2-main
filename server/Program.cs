using PDF2;
using PDF1;
using Newtonsoft.Json.Linq;

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
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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


JArray dataArray = null;
app.MapPost("/excelData", async (HttpRequest request) =>
{
    using (StreamReader reader = new StreamReader(request.Body))
    {
        string jsonString = await reader.ReadToEndAsync();
        JObject jsonData = JObject.Parse(jsonString);
        string type = jsonData["type"].ToString();

        Console.WriteLine(type);
        
        // Handle JSON data here
        // Example: Extract data from JSON object
        int nbRows = 4;
        int nbCols = 12;
       dataArray = (JArray)jsonData["dataArray"];
        if (type == "A5"){
            if (dataArray != null){
             var pdf = new Generate65PDF1(210, 297,3,12,1,1,8,true,"center","128",dataArray);
             }else{
                return Results.BadRequest("Failed to read PDF file. Please try again later.");
             }
        }else{
            if (dataArray != null){
                var pdf = new Generate24PDF1(37,70,2,10,1,1,8,true,"center","128",dataArray);
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

app.MapPost("/params", (string paperWidth, string paperHeight,string nbRows,string nbCols,string pageTopMargin,string pageBottomMargin,string type,string titleAlign,string titleSize,string titleBold,string barcodeType) =>
{
    Console.WriteLine("{0} {1}", paperHeight, paperWidth);
    
    // Convert paperWidth and paperHeight to integers
    int width = Convert.ToInt32(paperWidth);
    int height = Convert.ToInt32(paperHeight);
    int rows = Convert.ToInt32(nbRows);
    int cols = Convert.ToInt32(nbCols) * 3 +1 ;
    int bottomMargin = Convert.ToInt32(pageBottomMargin);
    int topMargin = Convert.ToInt32(pageTopMargin);
    int tSize = Convert.ToInt32(titleSize);
    bool tBold = Convert.ToBoolean(titleBold);
    string tAlign = titleAlign;
    
    var filePath = "";
    if(type == "A5"){
    // Generate PDF with the specified width and height
        if(dataArray != null){
            var pdf = new Generate65PDF1(width, height,rows,cols,bottomMargin,topMargin,tSize,tBold,tAlign,barcodeType,dataArray);
    
        }else{
            return Results.BadRequest("Failed to read PDF file. Please try again later.");
        }
        filePath = "65pdf.pdf"; // Path to the generated PDF file
    }else{
        if(dataArray!=null){
            var pdf = new Generate24PDF1(width,height,3,12,bottomMargin,topMargin,tSize,tBold,tAlign,barcodeType,dataArray);
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
