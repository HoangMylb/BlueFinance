# ─── Stage 1: Build ────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy solution and project files
COPY BlueFinance.sln .
COPY src/BlueFinance.API/BlueFinance.API.csproj src/BlueFinance.API/
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish src/BlueFinance.API/BlueFinance.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ─── Stage 2: Runtime ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

EXPOSE 8080

# Copy published output
COPY --from=build /app/publish .

# Render overrides PORT via env var at runtime
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "BlueFinance.API.dll"]
