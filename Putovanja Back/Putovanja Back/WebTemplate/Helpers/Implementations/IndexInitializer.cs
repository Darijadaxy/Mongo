using MongoDB.Driver;

public class IndexInitializer : IIndexInitializer
{
    private readonly IMongoCollection<Trip> _tripCollection;

    public IndexInitializer(IMongoDatabase database)
    {
        _tripCollection = database.GetCollection<Trip>("trips");
    }

    public async Task CreateIndexesAsync()
    {
        var compositeIndex = Builders<Trip>.IndexKeys
            .Ascending(t => t.Price)
            .Ascending(t => t.AverageRating)
            .Ascending(t => t.Vehicle);

        var dateRangeIndex = Builders<Trip>.IndexKeys 
            .Ascending("AvailableDates.StartDate")
            .Ascending("AvailableDates.EndDate");

        var textIndex = Builders<Trip>.IndexKeys
            .Text(t => t.Name)
            .Text("Destinations.Name");

        var indexModels = new List<CreateIndexModel<Trip>>
        {
            new CreateIndexModel<Trip>(compositeIndex, new CreateIndexOptions { Name = "idx_price_avgRating_transport", Background = true }),
            new CreateIndexModel<Trip>(dateRangeIndex, new CreateIndexOptions { Name = "idx_dateRange", Background = true }),
            new CreateIndexModel<Trip>(textIndex, new CreateIndexOptions { Name = "idx_text_search", Background = true })
        };

        await _tripCollection.Indexes.CreateManyAsync(indexModels);
    }
}