// Real payment history data
let paymentHistory = [];
let currentPage = 1;
let pageSize = 5; // Changed to 5 items per page
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
        
        // Update pagination
        updatePagination(dataToShow.length);
        return;
    }
    
    // Calculate pagination
    totalPages = Math.ceil(dataToShow.length / pageSize);
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    
    // Get current page items
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, dataToShow.length);
    const currentPageItems = dataToShow.slice(startIndex, endIndex);
    
    // Display current page items
    currentPageItems.forEach(payment => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'list-item';
        
        const typeClass = `type-${payment.type}`;
        const statusClass = `status-${payment.status}`;
        
        // Prepare payment description with proper type
        let description = payment.description;
        if (!description) {
            if (payment.type === 'rent') {
                description = `Monthly Rent: ${new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' })}`;
            } else if (payment.type === 'maintenance') {
                description = `Service: ${payment.service || 'Maintenance'}`;
            } else if (payment.type === 'facilities') {
                description = `Facility: ${payment.facility || 'Reservation'}`;
            }
        }
        
        let receiptButton = '';
        if (payment.status === 'completed' || payment.status === 'approved') {
            receiptButton = `
                <a href="#" class="receipt-button" onclick="viewReceipt('${payment.id}')">
                    <i class="fas fa-receipt"></i>
                </a>
            `;
        }
        
        paymentItem.innerHTML = `
            <div class="item-date">${formatDate(payment.date)}</div>
            <div class="item-description">${description}</div>
            <div class="item-type ${typeClass}">
                <i class="${getTypeIcon(payment.type)}"></i> ${formatType(payment.type)}
                <span class="payment-method">${payment.method || 'Credit Card'}</span>
            </div>
            <div class="item-amount">$${typeof payment.amount === 'number' ? payment.amount.toFixed(2) : payment.amount}</div>
            <div class="item-status ${statusClass}">
                <i class="${getStatusIcon(payment.status)}"></i> ${formatStatus(payment.status)}
                ${receiptButton}
            </div>
        `;
        
        container.appendChild(paymentItem);
    });
    
    // Update pagination controls
    updatePagination(dataToShow.length);
}

function updatePagination(totalItems) {
    totalPages = Math.ceil(totalItems / pageSize);
    
    // Update pagination text
    document.querySelector('.current-page').textContent = currentPage;
    document.querySelector('.total-pages').textContent = totalPages;
    
    // Enable/disable pagination buttons
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        loadPaymentHistory();
    }
}

function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        loadPaymentHistory();
    }
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
    
    // Reset to page 1 when filtering
    currentPage = 1;
    
    // Display filtered data
    loadPaymentHistory(filteredData);
}

function resetFilters() {
    document.getElementById('paymentType').value = 'all';
    document.getElementById('dateRange').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    
    // Reset to page 1
    currentPage = 1;
    
    // Reset to original data
    loadPaymentHistory();
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatType(type) {
    switch(type) {
        case 'maintenance':
            return 'Maintenance';
        case 'facilities':
            return 'Facility';
        case 'rent':
            return 'Rent';
        default:
            return 'Other';
    }
}

function getTypeIcon(type) {
    switch(type) {
        case 'maintenance':
            return 'fas fa-tools';
        case 'facilities':
            return 'fas fa-building';
        case 'rent':
            return 'fas fa-home';
        default:
            return 'fas fa-money-bill';
    }
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
                    service: request.service,
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
                    facility: reservation.facility,
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
        
        // Process rent payments
        const rentPayments = [];
        if (data.rentPayments && data.rentPayments.length > 0) {
            data.rentPayments.forEach(payment => {
                rentPayments.push({
                    id: 'rp-' + payment.id,
                    date: payment.date,
                    description: `Monthly Rent: ${new Date(payment.date).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
                    type: 'rent',
                    amount: parseFloat(payment.amount),
                    status: "completed",
                    method: payment.paymentMethod || "Credit Card",
                    receipt: `rent_receipt_${payment.id}.pdf`
                });
            });
        }
        
        // Combine and sort by date (newest first)
        paymentHistory = [...servicePayments, ...facilityPayments, ...rentPayments].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        // Reset to page 1 when loading new data
        currentPage = 1;
        
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
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = stats.rentCount.toString();
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = stats.serviceCount.toString();
    document.querySelector('.stat-card:nth-child(5) .stat-value').textContent = stats.facilityCount.toString();
}

// Update chart data from API response
function updateChartDataFromAPI(monthlyData) {
    if (!monthlyData || monthlyData.length === 0) {
        return;
    }
    
    // Process the data for the chart
    const labels = [];
    const rentData = [];
    const maintenanceData = [];
    const facilitiesData = [];
    
    // Sort by date (oldest first)
    monthlyData.sort((a, b) => {
        if (a.year !== b.year) {
            return a.year - b.year;
        }
        // Convert month name to number for comparison
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
    });
    
    // Extract data for chart
    monthlyData.forEach(item => {
        labels.push(`${item.month} ${item.year}`);
        rentData.push(item.rentSpending);
        maintenanceData.push(item.serviceSpending);
        facilitiesData.push(item.facilitySpending);
    });
    
    // Update the chart with new data
    if (window.spendingChart) {
        window.spendingChart.data.labels = labels;
        window.spendingChart.data.datasets[0].data = rentData;
        window.spendingChart.data.datasets[1].data = maintenanceData;
        window.spendingChart.data.datasets[2].data = facilitiesData;
        window.spendingChart.update();
    } else {
        initSpendingChart(labels, rentData, maintenanceData, facilitiesData);
    }
}

// Initialize the spending chart
function initSpendingChart(labels = [], rentData = [], maintenanceData = [], facilitiesData = []) {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    window.spendingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Rent',
                    data: rentData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Maintenance',
                    data: maintenanceData,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Facilities',
                    data: facilitiesData,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: false,
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// View receipt function (placeholder for now)
function viewReceipt(paymentId) {
    console.log('Viewing receipt for payment ID:', paymentId);
    Swal.fire({
        title: 'Receipt',
        text: `Viewing receipt for payment #${paymentId}`,
        icon: 'info',
        confirmButtonText: 'Close'
    });
}