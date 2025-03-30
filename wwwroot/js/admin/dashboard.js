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
    
    // Service Requests Chart Data
    const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Service Requests',
            data: [12, 19, 15, 20, 14, 8, 10],
            backgroundColor: 'rgba(109, 76, 65, 0.7)',
            borderColor: 'rgba(109, 76, 65, 1)',
            borderWidth: 1,
            borderRadius: 6
        }]
    };
    
    const monthlyData = {
        labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
        datasets: [{
            label: 'Service Requests',
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 20) + 5),
            backgroundColor: 'rgba(109, 76, 65, 0.7)',
            borderColor: 'rgba(109, 76, 65, 1)',
            borderWidth: 1,
            borderRadius: 6
        }]
    };
    
    const yearlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Service Requests',
            data: [45, 60, 55, 70, 65, 80, 90, 85, 75, 95, 100, 110],
            backgroundColor: 'rgba(109, 76, 65, 0.7)',
            borderColor: 'rgba(109, 76, 65, 1)',
            borderWidth: 1,
            borderRadius: 6
        }]
    };
    
    // Service Requests Chart Config
    const serviceRequestsConfig = {
        type: 'bar',
        data: weeklyData, // Set to weekly data by default
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
                        stepSize: 20
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
    const serviceRequestsChart = new Chart(serviceRequestsCtx, serviceRequestsConfig);
    
    // Facility Ratings Pie Chart
    const facilityRatingsCtx = document.getElementById('facilityRatingsChart').getContext('2d');
    const facilityRatingsChart = new Chart(facilityRatingsCtx, {
        type: 'pie',
        data: {
            labels: ['Function Hall', 'Sports Court', 'Swimming Pool', 'Fitness Gym'],
            datasets: [{
                data: [4.7, 4.2, 4.5, 4.8],
                backgroundColor: [
                    'rgba(109, 76, 65, 0.8)',
                    'rgba(130, 61, 40, 0.8)',
                    'rgba(166, 97, 76, 0.8)',
                    'rgba(201, 133, 112, 0.8)'
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
    });
    
    // Handle period change for service requests chart
    document.getElementById('serviceRequestPeriod').addEventListener('change', function() {
        switch(this.value) {
            case 'week':
                serviceRequestsChart.data = weeklyData;
                break;
            case 'month':
                serviceRequestsChart.data = monthlyData;
                break;
            case 'year':
                serviceRequestsChart.data = yearlyData;
                break;
        }
        serviceRequestsChart.update();
    });
});