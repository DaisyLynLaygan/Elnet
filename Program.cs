using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using HomeOwner.Data;
using System.Net.WebSockets;
using System.Text;
using Newtonsoft.Json;
using HomeOwner.Models;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddSingleton<CommentWebSocketManager>();
builder.Services.AddSingleton<LikeWebSocketManager>();

var app = builder.Build();

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    context.Response.Headers["Pragma"] = "no-cache";
    context.Response.Headers["Expires"] = "0";

    await next();
});

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowAll");
app.UseSession();
app.UseAuthorization();
app.UseWebSockets();

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws/admin" || 
        context.Request.Path == "/ws/dashboard" || 
        context.Request.Path == "/ws/comments" ||
        context.Request.Path == "/ws/likes")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();

            if (context.Request.Path == "/ws/admin")
            {
                var webSocketManager = context.RequestServices.GetRequiredService<WebSocketManager>();
                await webSocketManager.HandleAdminConnection(webSocket);
            }
            else if (context.Request.Path == "/ws/dashboard")
            {
                var webSocketManager = context.RequestServices.GetRequiredService<WebSocketManager>();
                await webSocketManager.HandleDashboardConnection(webSocket);
            }
            else if (context.Request.Path == "/ws/comments")
            {
                var commentWebSocketManager = context.RequestServices.GetRequiredService<CommentWebSocketManager>();
                await commentWebSocketManager.HandleCommentConnection(webSocket);
            }
            else if (context.Request.Path == "/ws/likes")
            {
                var likeWebSocketManager = context.RequestServices.GetRequiredService<LikeWebSocketManager>();
                await likeWebSocketManager.HandleLikeConnection(webSocket);
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

public class CommentWebSocketManager
{
    private readonly List<WebSocket> _commentSockets = new();
    private readonly ILogger<CommentWebSocketManager> _logger;

    public CommentWebSocketManager(ILogger<CommentWebSocketManager> logger)
    {
        _logger = logger;
    }

    public async Task HandleCommentConnection(WebSocket webSocket)
    {
        _commentSockets.Add(webSocket);
        await HandleConnection(webSocket);
    }

    private async Task HandleConnection(WebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];
        try
        {
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }

            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Comment WebSocket error: {ex.Message}");
        }
        finally
        {
            _commentSockets.Remove(webSocket);
            _logger.LogInformation("Comment WebSocket connection closed");
        }
    }

    public async Task BroadcastComment(int postId, Comment comment, User author, int commentCount)
    {
        var message = JsonConvert.SerializeObject(new
        {
            type = "new_comment",
            postId,
            comment = new
            {
                id = comment.comment_id,
                content = comment.content,
                createdDate = comment.created_date?.ToString("MMMM dd, yyyy hh:mm tt"),
                author = new
                {
                    id = author.user_id,
                    name = $"{author.firstname} {author.lastname}",
                    role = author.role
                }
            },
            commentCount
        });

        var buffer = Encoding.UTF8.GetBytes(message);
        var tasks = new List<Task>();

        foreach (var socket in _commentSockets.Where(s => s.State == WebSocketState.Open))
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

public class WebSocketManager
{
    private readonly List<WebSocket> _adminSockets = new();
    private readonly List<WebSocket> _dashboardSockets = new();
    private readonly ILogger<WebSocketManager> _logger;
    private readonly Dictionary<string, string> _facilityStatuses = new();

    public WebSocketManager(ILogger<WebSocketManager> logger)
    {
        _logger = logger;
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

    public async Task BroadcastLike(int postId, int likeCount, int userId, bool isLiked)
    {
        var message = JsonConvert.SerializeObject(new
        {
            type = "like_update",
            postId,
            likeCount,
            userId,
            isLiked
        });

        var buffer = Encoding.UTF8.GetBytes(message);
        var tasks = new List<Task>();

        foreach (var socket in _dashboardSockets.Where(s => s.State == WebSocketState.Open))
        {
            tasks.Add(socket.SendAsync(
                new ArraySegment<byte>(buffer),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None));
        }

        await Task.WhenAll(tasks);
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
public class LikeWebSocketManager
{
    private readonly List<WebSocket> _likeSockets = new();
    private readonly ILogger<LikeWebSocketManager> _logger;

    public LikeWebSocketManager(ILogger<LikeWebSocketManager> logger)
    {
        _logger = logger;
    }

    public async Task HandleLikeConnection(WebSocket webSocket)
    {
        _likeSockets.Add(webSocket);
        await HandleConnection(webSocket);
    }

    private async Task HandleConnection(WebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];
        try
        {
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            }

            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Like WebSocket error: {ex.Message}");
        }
        finally
        {
            _likeSockets.Remove(webSocket);
            _logger.LogInformation("Like WebSocket connection closed");
        }
    }

    public async Task BroadcastLikeUpdate(int postId, int likeCount, int userId, bool isLiked)
    {
        var message = JsonConvert.SerializeObject(new
        {
            type = "like_update",
            postId,
            likeCount,
            userId,
            isLiked
        });

        var buffer = Encoding.UTF8.GetBytes(message);
        var tasks = new List<Task>();

        foreach (var socket in _likeSockets.Where(s => s.State == WebSocketState.Open))
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