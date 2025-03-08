# Medicine Buddy

## Pages
- Auth
  - Login
  - Register
- App
  - Symptoms with disease
  - Questions
  - Medicine
- User
  - Profile
  - History

`

### Login info
```
Username: a1
Pasword: a1
```

### frontend - angular 15
```
https://nodejs.org/en/download
npm install -g @angular/cli@15.2.0


cd frontend/medicine-buddy-web-ng
npm i
ng serve --o
```

### backend - dotnet 9
```
install dotnet 9.0 sdk => https://dotnet.microsoft.com/en-us/download/dotnet/9.0

cd backend/MedicineBuddy.App
dotnet build
dotnet run --project MedicineBuddy.Main.API.csproj
```

### db - MySQL
```
MySQL community edition 8+ => https://dev.mysql.com/downloads/installer/
---

docker install https://www.docker.com/get-started/

docker up => docker-compose up -d
docker down (with volume) => docker-compose down --rmi local --volumes
docker down (without volume) => docker-compose down --rmi local
docker container check => docker ps
```