FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el archivo de proyecto del Backend
COPY ["Backend/Backend.csproj", "./Backend/"]
RUN dotnet restore "./Backend/Backend.csproj"

# Copiar código del Backend
COPY Backend/ ./Backend/
RUN dotnet publish "Backend/Backend.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Puerto para Render
EXPOSE 10000

ENTRYPOINT ["dotnet", "Backend.dll"]
