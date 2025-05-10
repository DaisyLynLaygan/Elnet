document.addEventListener('DOMContentLoaded', function() {
    // Set current month for survey tracking
    document.getElementById('currentMonth').textContent = moment().format('MMMM YYYY');
    
    // Custom select styling
    document.querySelectorAll('.custom-select select').forEach(select => {
        select.addEventListener('change', function() {
            this.style.color = '#333';
        });
        // Set initial color
        if (select.value) select.style.color = '#333';
    });
    
    // Initialize charts with placeholders first
    let serviceRequestsChart, facilityRatingsChart;
    
    // Initialize Service Requests Chart with empty data
    const serviceRequestsConfig = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Service Requests',
                data: [],
                backgroundColor: 'rgba(109, 76, 65, 0.7)',
                borderColor: 'rgba(109, 76, 65, 1)',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        stepSize: 5
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    };
    
    // Initialize Service Requests Chart
    const serviceRequestsCtx = document.getElementById('serviceRequestsChart').getContext('2d');
    serviceRequestsChart = new Chart(serviceRequestsCtx, serviceRequestsConfig);
    
    // Initialize Facility Ratings Pie Chart with empty data
    const facilityRatingsConfig = {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgba(109, 76, 65, 0.8)',
                    'rgba(130, 61, 40, 0.8)',
                    'rgba(166, 97, 76, 0.8)',
                    'rgba(201, 133, 112, 0.8)',
                    'rgba(108, 52, 131, 0.8)'
                ],
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}/5 rating`;
                        }
                    }
                }
            }
        }
    };
    
    const facilityRatingsCtx = document.getElementById('facilityRatingsChart').getContext('2d');
    facilityRatingsChart = new Chart(facilityRatingsCtx, facilityRatingsConfig);
    
    // Function to fetch service request data
    function fetchServiceRequestData(period = 'week') {
        fetch(`/Admin/GetServiceRequestsData?period=${period}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update chart data
                    serviceRequestsChart.data.labels = data.labels;
                    serviceRequestsChart.data.datasets[0].data = data.values;
                    serviceRequestsChart.update();
                } else {
                    console.error('Error fetching service request data:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching service request data:', error);
            });
    }
    
    // Function to fetch facility ratings data
    function fetchFacilityRatingsData(view = 'current') {
        fetch(`/Admin/GetFacilityRatingsData?view=${view}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update chart data
                    facilityRatingsChart.data.labels = data.labels;
                    facilityRatingsChart.data.datasets[0].data = data.values;
                    
                    // Update tooltip to show count if requested
                    if (view === 'count') {
                        facilityRatingsChart.options.plugins.tooltip.callbacks.label = function(context) {
                            return `${context.label}: ${context.raw} bookings`;
                        };
                    } else {
                        facilityRatingsChart.options.plugins.tooltip.callbacks.label = function(context) {
                            return `${context.label}: ${context.raw}/5 rating`;
                        };
                    }
                    
                    facilityRatingsChart.update();
                } else {
                    console.error('Error fetching facility ratings data:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching facility ratings data:', error);
            });
    }
    
    // Initial data fetch
    fetchServiceRequestData('week');
    fetchFacilityRatingsData('current');
    
    // Handle period change for service requests chart
    document.getElementById('serviceRequestPeriod').addEventListener('change', function() {
        fetchServiceRequestData(this.value);
    });
    
    // Handle view change for facility ratings chart
    document.querySelector('.chart-card:nth-child(2) .custom-select select').addEventListener('change', function() {
        fetchFacilityRatingsData(this.value);
    });
    
    // Set up auto-refresh for real-time updates (every 60 seconds)
    setInterval(() => {
        const serviceRequestPeriod = document.getElementById('serviceRequestPeriod').value;
        const facilityRatingsView = document.querySelector('.chart-card:nth-child(2) .custom-select select').value;
        
        fetchServiceRequestData(serviceRequestPeriod);
        fetchFacilityRatingsData(facilityRatingsView);
    }, 60000); // Refresh every minute
});