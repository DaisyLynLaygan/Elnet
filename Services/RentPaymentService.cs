using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using HomeOwner.Controllers;

namespace HomeOwner.Services
{
    public class RentPaymentService : BackgroundService
    {
        private readonly ILogger<RentPaymentService> _logger;
        private readonly IServiceProvider _serviceProvider;

        public RentPaymentService(ILogger<RentPaymentService> logger, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Rent Payment Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Rent Payment Service running at: {time}", DateTimeOffset.Now);

                // Check if it's the right time to generate rent payments (e.g., first day of the month)
                var today = DateTime.Now;
                if (today.Day == 1)
                {
                    try
                    {
                        // Create a scope to resolve scoped services
                        using (var scope = _serviceProvider.CreateScope())
                        {
                            var homeownerController = scope.ServiceProvider.GetRequiredService<HomeownerController>();
                            await homeownerController.GenerateMonthlyRentPaymentsForAllUsers();
                            _logger.LogInformation("Monthly rent payments generated successfully.");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error generating monthly rent payments");
                    }
                }

                // Wait for 24 hours before checking again
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }

            _logger.LogInformation("Rent Payment Service is stopping.");
        }
    }
} 