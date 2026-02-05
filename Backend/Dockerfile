FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el archivo de proyecto
COPY ["Backend/Backend.csproj", "./"]
RUN dotnet restore "./Backend.csproj"

# Copiar todo el código y publicar
COPY Backend/ ./
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Puerto para Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# Ejecutar la aplicación
ENTRYPOINT ["dotnet", "Backend.dll"]