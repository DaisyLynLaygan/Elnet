// Real payment history data
let paymentHistory = [];
let currentPage = 1;
let pageSize = 10;
let totalPages = 1;

// Initial empty chart data
const emptyChartData = {
    labels: [],
    rent: [],
    maintenance: [],
    facilities: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the spending chart with empty data
    initSpendingChart();
    
    // Load real payment history from the server
    fetchRealPaymentHistory();
    
    // Set up filter event listeners
    document.getElementById('paymentType').addEventListener('change', filterHistory);
    document.getElementById('dateRange').addEventListener('change', filterHistory);
    document.getElementById('statusFilter').addEventListener('change', filterHistory);
    document.querySelector('.reset-filters').addEventListener('click', resetFilters);
    
    // Pagination buttons
    document.getElementById('prevPage').addEventListener('click', goToPreviousPage);
    document.getElementById('nextPage').addEventListener('click', goToNextPage);
    
    // Time filter for chart
    document.getElementById('timeFilter').addEventListener('change', function() {
        // Reload payment history with new time range
        fetchRealPaymentHistory();
    });
});

function initSpendingChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    window.spendingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Rent',
                    data: [],
                    backgroundColor: 'rgba(107, 68, 35, 0.8)',
                    borderColor: 'rgba(107, 68, 35, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Maintenance',
                    data: [],
                    backgroundColor: 'rgba(78, 121, 167, 0.8)',
                    borderColor: 'rgba(78, 121, 167, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Facilities',
                    data: [],
                    backgroundColor: 'rgba(89, 161, 79, 0.8)',
                    borderColor: 'rgba(89, 161, 79, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Amount ($)',
                        color: 'var(--text-gray)'
                    },
                    ticks: {
                        color: 'var(--text-gray)',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Month',
                        color: 'var(--text-gray)'
                    },
                    ticks: {
                        color: 'var(--text-gray)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    backgroundColor: 'var(--white)',
                    titleColor: 'var(--dark-brown)',
                    bodyColor: 'var(--text-dark)',
                    borderColor: 'var(--border-color)',
                    borderWidth: 1,
                    padding: 12,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toLocaleString();
                        },
                        labelColor: function(context) {
                            return {
                                borderColor: context.dataset.borderColor,
                                backgroundColor: context.dataset.backgroundColor,
                                borderWidth: 2,
                                borderRadius: 2
                            };
                        }
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: 'var(--text-dark)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function loadPaymentHistory(filteredData = null) {
    const container = document.getElementById('paymentHistoryItems');
    container.innerHTML = '';
    
    const dataToShow = filteredData || paymentHistory;
    
    if (dataToShow.length === 0) {
        container.innerHTML = `
            <div class="no-payments">
                <i class="fas fa-file-invoice-dollar"></i>
                <p>No payments found matching your criteria</p>
                <button class="reset-filters" onclick="resetFilters()">
                    <i class="fas fa-sync-alt"></i> Reset Filters
                </button>
            </div>
        `;
        return;
    }
    
    dataToShow.forEach(payment => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'list-item';
        
        const typeClass = `type-${payment.type}`;
        const statusClass = `status-${payment.status}`;
        
        paymentItem.innerHTML = `
            <div class="item-date">${formatDate(payment.date)}</div>
            <div class="item-description">${payment.description}</div>
            <div class="item-type ${typeClass}">
                <i class="${getTypeIcon(payment.type)}"></i> ${formatType(payment.type)}
                <span class="payment-method">${payment.method}</span>
            </div>
            <div class="item-amount">$${payment.amount.toFixed(2)}</div>
            <div class="item-status ${statusClass}">
                <i class="${getStatusIcon(payment.status)}"></i> ${formatStatus(payment.status)}
            </div>
          
        `;
        
        container.appendChild(paymentItem);
    });
}

function filterHistory() {
    const typeFilter = document.getElementById('paymentType').value;
    const dateFilter = document.getElementById('dateRange').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredData = [...paymentHistory]; // Clone the array to avoid modifying the original
    
    // Filter by type
    if (typeFilter !== 'all') {
        filteredData = filteredData.filter(payment => payment.type === typeFilter);
    }
    
    // Filter by date range
    if (dateFilter !== 'all') {
        const today = new Date();
        let startDate;
        
        switch(dateFilter) {
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case '3month':
                startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
        }
        
        filteredData = filteredData.filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate >= startDate;
        });
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
        filteredData = filteredData.filter(payment => payment.status === statusFilter);
    }
    
    // Display filtered data
    loadPaymentHistory(filteredData);
}

function resetFilters() {
    document.getElementById('paymentType').value = 'all';
    document.getElementById('dateRange').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    
    // Reset to original data
    loadPaymentHistory();
}

function goToPreviousPage() {
    // In a real app, this would load the previous page of results
    console.log('Previous page clicked');
}

function goToNextPage() {
    // In a real app, this would load the next page of results
    console.log('Next page clicked');
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatType(type) {
    const typeNames = {
        rent: 'Rent',
        maintenance: 'Maintenance',
        facilities: 'Facilities'
    };
    return typeNames[type] || type;
}

function getTypeIcon(type) {
    const typeIcons = {
        rent: 'fas fa-home',
        maintenance: 'fas fa-tools',
        facilities: 'fas fa-umbrella-beach'
    };
    return typeIcons[type] || 'fas fa-receipt';
}

function formatStatus(status) {
    const statusNames = {
        'completed': 'Completed',
        'pending': 'Pending',
        'approved': 'Approved',
        'in-progress': 'In Progress',
        'rejected': 'Rejected',
        'cancelled': 'Cancelled'
    };
    return statusNames[status] || status;
}

function getStatusIcon(status) {
    const statusIcons = {
        'completed': 'fas fa-check-circle',
        'pending': 'fas fa-clock',
        'approved': 'fas fa-thumbs-up',
        'in-progress': 'fas fa-spinner fa-spin',
        'rejected': 'fas fa-times-circle',
        'cancelled': 'fas fa-ban'
    };
    return statusIcons[status] || 'fas fa-info-circle';
}

// Fetch real payment history from service requests and facility reservations
async function fetchRealPaymentHistory() {
    try {
        // Show loading state
        const container = document.getElementById('paymentHistoryItems');
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading your payment history...</p>
            </div>
        `;
        
        // Get time filter value
        const timeRange = document.getElementById('timeFilter').value;
        
        // Fetch payment history from our new endpoint with time range parameter
        const response = await fetch(`/Homeowner/GetPaymentHistory?months=${timeRange}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Failed to load payment history');
        }
        
        // Process service requests
        const servicePayments = [];
        if (data.serviceRequests && data.serviceRequests.length > 0) {
            data.serviceRequests.forEach(request => {
                servicePayments.push({
                    id: 'sr-' + request.id,
                    date: request.date,
                    description: `Service: ${request.service}`,
                    type: 'maintenance',
                    amount: parseFloat(request.amount),
                    status: request.status === "Completed" ? "completed" : 
                           request.status === "Approved" ? "approved" :
                           request.status === "In Progress" ? "in-progress" : "pending",
                    method: "Credit Card",
                    receipt: request.status === "Completed" ? `service_receipt_${request.id}.pdf` : null
                });
            });
        }
        
        // Process facility reservations
        const facilityPayments = [];
        if (data.facilityReservations && data.facilityReservations.length > 0) {
            data.facilityReservations.forEach(reservation => {
                facilityPayments.push({
                    id: 'fr-' + reservation.id,
                    date: reservation.date,
                    description: `Facility: ${reservation.facility}`,
                    type: 'facilities',
                    amount: parseFloat(reservation.amount),
                    status: reservation.status === "Completed" ? "completed" : 
                           reservation.status === "Approved" ? "approved" :
                           reservation.status === "In Progress" ? "in-progress" : "pending",
                    method: "Credit Card",
                    receipt: reservation.status === "Completed" ? `facility_receipt_${reservation.id}.pdf` : null
                });
            });
        }
        
        // Combine and sort by date (newest first)
        paymentHistory = [...servicePayments, ...facilityPayments].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Update stats directly from the API response
        updatePaymentStatsFromData(data.stats);
        
        // Update chart data directly from the API response
        updateChartDataFromAPI(data.monthlySpending);
        
        // Display payment history
        loadPaymentHistory();
        
    } catch (error) {
        console.error('Error fetching payment history:', error);
        const container = document.getElementById('paymentHistoryItems');
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading payment history: ${error.message}</p>
                <button class="retry-button" onclick="fetchRealPaymentHistory()">Retry</button>
            </div>
        `;
    }
}

// Update payment statistics from API data
function updatePaymentStatsFromData(stats) {
    // Update stats in the UI using the data from the API
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = '$' + stats.totalSpent.toFixed(2);
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = '$' + stats.thisMonthSpending.toFixed(2);
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = '0'; // Rent Payments (not implemented yet)
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = stats.serviceCount.toString();
    
    // Add a new card for facility reservations if it doesn't exist
    if (!document.querySelector('.stat-card:nth-child(5)')) {
        const statsContainer = document.querySelector('.history-stats');
        const facilityCard = document.createElement('div');
        facilityCard.className = 'stat-card';
        facilityCard.innerHTML = `
            <div class="stat-icon">
                <i class="fas fa-building"></i>
            </div>
            <div class="stat-info">
                <span class="stat-label">Facilities</span>
                <span class="stat-value">${stats.facilityCount}</span>
            </div>
        `;
        statsContainer.appendChild(facilityCard);
    } else {
        document.querySelector('.stat-card:nth-child(5) .stat-value').textContent = stats.facilityCount.toString();
    }
}

// Update chart data from API data
function updateChartDataFromAPI(monthlySpendingData) {
    // Sort monthly spending data by year and month (oldest to newest)
    const sortedData = monthlySpendingData.sort((a, b) => {
        if (a.year !== b.year) {
            return a.year - b.year;
        }
        // Get month number from month name
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.indexOf(a.month) - months.indexOf(b.month);
    });
    
    // Extract labels and data for chart
    const labels = sortedData.map(item => item.month);
    const serviceData = sortedData.map(item => parseFloat(item.serviceSpending));
    const facilityData = sortedData.map(item => parseFloat(item.facilitySpending));
    const rentData = sortedData.map(item => parseFloat(item.rentSpending));
    
    // Update chart data
    window.spendingChart.data.labels = labels;
    window.spendingChart.data.datasets[0].data = rentData;
    window.spendingChart.data.datasets[1].data = serviceData;
    window.spendingChart.data.datasets[2].data = facilityData;
    window.spendingChart.update();
}