using MySql.Data.MySqlClient;

namespace MedicineBuddy.Main.API.Repositories;

public interface IDbConnectionRepository
{
    Task<List<T>> ExecuteReadAsync<T>(string query, Dictionary<string, object> parameters) where T : new();
    Task<int> ExecuteWriteAsync(string query, Dictionary<string, object> parameters);
}

public class DbConnectionRepository : IDbConnectionRepository
{
    private readonly string _connectionString;

    public DbConnectionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetValue<string>("Database:DefaultConnection");
    }


    /// <summary>
    /// Executes SELECT queries and maps the results to a List of specified type
    /// </summary>
    public async Task<List<T>> ExecuteReadAsync<T>(string query, Dictionary<string, object> parameters) where T : new()
    {
        var resultList = new List<T>();

        using var conn = new MySqlConnection(_connectionString);
        await conn.OpenAsync(); // Open connection asynchronously

        using var cmd = new MySqlCommand(query, conn);
        if (parameters != null)
        {
            foreach (var param in parameters)
                cmd.Parameters.AddWithValue(param.Key, param.Value);
        }

        using var reader = await cmd.ExecuteReaderAsync(); // Execute the reader asynchronously
        while (await reader.ReadAsync()) // Read asynchronously
        {
            T obj = new T();
            foreach (var prop in typeof(T).GetProperties())
            {
                if (!reader.IsDBNull(reader.GetOrdinal(prop.Name)))
                    prop.SetValue(obj, reader[prop.Name]);
            }
            resultList.Add(obj);
        }

        return resultList;
    }


    /// <summary>
    /// Executes Write operations (Insert, Update, Delete) and returns the number of rows affected
    /// </summary>
    public async Task<int> ExecuteWriteAsync(string query, Dictionary<string, object> parameters)
    {
        using var conn = new MySqlConnection(_connectionString);
        await conn.OpenAsync(); // Open connection asynchronously

        using var transaction = await conn.BeginTransactionAsync(); // Begin transaction asynchronously
        try
        {
            using var cmd = new MySqlCommand(query, conn, transaction);
            if (parameters != null)
            {
                foreach (var param in parameters)
                    cmd.Parameters.AddWithValue(param.Key, param.Value);
            }

            int affectedRows = await cmd.ExecuteNonQueryAsync(); // Execute command asynchronously
            await transaction.CommitAsync(); // Commit transaction asynchronously
            return affectedRows; // Returns the number of rows affected
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(); // Rollback transaction asynchronously
            Console.WriteLine("Error: " + ex.Message);
            return -1;
        }
    }

}

