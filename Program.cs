using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using HomeOwner.Data;
using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Add CORS with more specific settings
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:5180", "https://localhost:5180")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Fixed DbContext configuration with proper parentheses
var connectionString = builder.Configuration.GetConnectionString("HomeOwnerContext") 
    ?? throw new InvalidOperationException("Connection string 'HomeOwnerContext' not found.");
    
builder.Services.AddDbContext<HomeOwnerContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<WebSocketManager>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Use CORS before WebSocket and other middleware
app.UseCors("AllowAll");

app.UseSession();
app.UseAuthorization();

// Add WebSocket middleware before MVC
app.UseWebSockets();

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws/admin" || context.Request.Path == "/ws/dashboard")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
            var webSocketManager = context.RequestServices.GetRequiredService<WebSocketManager>();
            
            if (context.Request.Path == "/ws/admin")
            {
                await webSocketManager.HandleAdminConnection(webSocket);
            }
            else if (context.Request.Path == "/ws/dashboard")
            {
                await webSocketManager.HandleDashboardConnection(webSocket);
            }
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
    else
    {
        await next();
    }
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

public class WebSocketManager
{
    private readonly List<WebSocket> _adminSockets = new();
    private readonly List<WebSocket> _dashboardSockets = new();
    private readonly ILogger<WebSocketManager> _logger;
    private readonly Dictionary<string, string> _facilityStatuses = new();

    public WebSocketManager(ILogger<WebSocketManager> logger)
    {
        _logger = logger;
        // Initialize default statuses
        _facilityStatuses.Add("function-hall", "available");
        _facilityStatuses.Add("sports-court", "available");
        _facilityStatuses.Add("swimming-pool", "available");
        _facilityStatuses.Add("fitness-gym", "available");
    }

    public async Task HandleAdminConnection(WebSocket webSocket)
    {
        _adminSockets.Add(webSocket);
        await SendCurrentStatuses(webSocket);
        await HandleConnection(webSocket, _adminSockets, "Admin");
    }

    public async Task HandleDashboardConnection(WebSocket webSocket)
    {
        _dashboardSockets.Add(webSocket);
        await SendCurrentStatuses(webSocket);
        await HandleConnection(webSocket, _dashboardSockets, "Dashboard");
    }

    private async Task SendCurrentStatuses(WebSocket webSocket)
    {
        var statuses = _facilityStatuses.Select(kv => new 
        { 
            facility = kv.Key, 
            status = kv.Value 
        }).ToList();
        
        var message = JsonConvert.SerializeObject(new 
        { 
            type = "current_statuses",
            statuses = statuses
        });
        
        var buffer = Encoding.UTF8.GetBytes(message);
        await webSocket.SendAsync(
            new ArraySegment<byte>(buffer),
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
    }

    private async Task HandleConnection(WebSocket webSocket, List<WebSocket> sockets, string connectionType)
    {
        var buffer = new byte[1024 * 4];
        try
        {
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            
            while (!result.CloseStatus.HasValue)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                _logger.LogInformation($"Received message from {connectionType}: {message}");
                
                try
                {
                    var data = JsonConvert.DeserializeObject<dynamic>(message);
                    
                    if (data?.type == "facility_status_update")
                    {
                        string facility = data.facility;
                        string status = data.status;
                        
                        if (_facilityStatuses.ContainsKey(facility))
                        {
                            _facilityStatuses[facility] = status;
                            await BroadcastToAll(message);
                        }
                    }
                    else if (data?.type == "request_current_statuses")
                    {
                        await SendCurrentStatuses(webSocket);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error processing message: {ex.Message}");
                }
                
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }
            
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
        catch (Exception ex)
        {
            _logger.LogError($"WebSocket error ({connectionType}): {ex.Message}");
        }
        finally
        {
            sockets.Remove(webSocket);
            _logger.LogInformation($"{connectionType} WebSocket connection closed");
        }
    }

    private async Task BroadcastToAll(string message)
    {
        var allSockets = new List<WebSocket>();
        allSockets.AddRange(_adminSockets);
        allSockets.AddRange(_dashboardSockets);

        var buffer = Encoding.UTF8.GetBytes(message);
        var tasks = new List<Task>();
        
        foreach (var socket in allSockets.Where(s => s.State == WebSocketState.Open))
        {
            tasks.Add(socket.SendAsync(
                new ArraySegment<byte>(buffer),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None));
        }

        await Task.WhenAll(tasks);
    }
}