using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;

public class ProductService
{
    private readonly IMongoCollection<Product> _productCollection;

    public ProductService(IMongoDatabase database)
    {
        _productCollection = database.GetCollection<Product>("Products");
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        await _productCollection.InsertOneAsync(product);
        return product;
    }

    public async Task<Product> GetProductByIdAsync(string id)
    {
        var product = await _productCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
        return product;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        var products = await _productCollection.Find(_ => true).ToListAsync();
        return products;
    }

    public async Task<IEnumerable<Product>> GetProductsByUserIdAsync(string userId)
    {
        var products = await _productCollection.Find(p => p.UserId == userId).ToListAsync();
        return products;
    }

    public async Task UpdateProductAsync(string id, Product product)
    {
        await _productCollection.ReplaceOneAsync(p => p.Id == id, product);
    }

    public async Task DeleteProductAsync(string id)
    {
        await _productCollection.DeleteOneAsync(p => p.Id == id);
    }
}
