FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["MedicineBuddy.Main.API/MedicineBuddy.Main.API.csproj", "MedicineBuddy.Main.API/"]
RUN dotnet restore "MedicineBuddy.Main.API/MedicineBuddy.Main.API.csproj"
COPY . .
WORKDIR "/src/MedicineBuddy.Main.API"
RUN dotnet build "MedicineBuddy.Main.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MedicineBuddy.Main.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MedicineBuddy.Main.API.dll"]