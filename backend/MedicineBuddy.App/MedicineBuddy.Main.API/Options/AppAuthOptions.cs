namespace MedicineBuddy.Main.API.Options;

public class AppAuthOptions
{

    ///
    /// Defines whether the bearer token should be stored in the AuthenticationProperties after a successful authorization.
    ///
    public bool SaveToken { get; set; }

    ///
    /// Gets or sets if HTTPS is required for the metadata address or authority.  This should be disabled only in development environments.
    ///
    public bool RequireHttpsMetadata { get; set; }

    /// <summary>
    /// Gets or sets whether to Validate Issuer
    /// </summary>
    public bool ValidateIssuer { get; set; }

    /// <summary>
    /// Gets or sets whether to Validate Audience (Requster)
    /// </summary>

    public bool ValidateAudience { get; set; }
    public int TokenLifetimeMinutes { get; set; }

    public int ClockSkewInMinutes { get; set; }

    /// <summary>
    /// Gets or sets the Authority
    /// </summary>
    public string Authority { get; set; }

    /// <summary>
    /// Gets or sets the Audience
    /// </summary>
    public string Audience { get; set; }

    /// <summary>
    /// Gets or sets the ValidAudience
    /// </summary>
    public string[] ValidAudience { get; set; }

    /// <summary>
    /// Gets or sets the SigningKey
    /// </summary>
    public string SigningKey { get; set; }
    public AppAuthOptions()
    {
        ClockSkewInMinutes = 1;
        SaveToken = true;
    }
}
