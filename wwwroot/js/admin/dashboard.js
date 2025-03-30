document.addEventListener('DOMContentLoaded', function() {
    // Service Requests Chart
    const serviceRequestsCtx = document.getElementById('serviceRequestsChart').getContext('2d');
    const serviceRequestsChart = new Chart(serviceRequestsCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Service Requests',
                data: [45, 60, 55, 70, 65, 80, 90],
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
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 12
                    },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Requests: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Facility Ratings Chart
    const facilityRatingsCtx = document.getElementById('facilityRatingsChart').getContext('2d');
    const facilityRatingsChart = new Chart(facilityRatingsCtx, {
        type: 'radar',
        data: {
            labels: ['Function Hall', 'Sports Court', 'Swimming Pool', 'Fitness Gym'],
            datasets: [{
                label: 'Average Rating',
                data: [4.7, 4.2, 4.5, 4.8],
                backgroundColor: 'rgba(106, 37, 16, 0.2)',
                borderColor: 'rgba(106, 37, 16, 0.8)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(106, 37, 16, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(106, 37, 16, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Handle period change for charts
    document.querySelectorAll('.period-select, .chart-period').forEach(select => {
        select.addEventListener('change', function() {
            // In a real app, you would fetch new data based on the selected period
            console.log(`Period changed to ${this.value}`);
        });
    });
});