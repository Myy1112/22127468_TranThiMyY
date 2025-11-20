# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy và restore project file
# SỬA: Copy TaskApi.csproj từ thư mục gốc vào thư mục gốc của container
COPY ["TaskApi.csproj", "."]
RUN dotnet restore "TaskApi.csproj"

# Copy toàn bộ source code còn lại (Controllers, Models, Program.cs, etc.)
COPY . .

# Publish (Tạo bản build cuối cùng)
# SỬA: Chạy lệnh publish từ thư mục gốc của project trong container
WORKDIR "/src"
RUN dotnet publish "TaskApi.csproj" -c Release -o /app/publish

# Stage 2: Create the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Mở cổng mặc định của Kestrel
EXPOSE 8080

# Copy output đã publish từ stage build
COPY --from=build /app/publish .

# Set entry point
ENTRYPOINT ["dotnet", "TaskApi.dll"]