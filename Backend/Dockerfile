FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el proyecto usando la ruta del monorepositorio
COPY ["backend-api.csproj", "./"]
RUN dotnet restore "./backend-api.csproj"

# Copiar todo el código y publicar
COPY . .
RUN dotnet publish "backend-api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Puerto para Render
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

# IMPORTANTE: Asegúrate de que el nombre sea exacto al de tu .csproj
ENTRYPOINT ["dotnet", "backend-api.dll"]