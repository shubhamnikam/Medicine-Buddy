var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.MedicineBuddy_Main_API>("MedicineBuddy-Main-Api");

builder.Build().Run();
