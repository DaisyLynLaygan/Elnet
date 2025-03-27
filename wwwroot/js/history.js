// Sample payment history data (in a real app, this would come from your backend)
const paymentHistory = [
    {
        id: 1,
        date: "2023-07-01",
        description: "Monthly Rent - Luxury Villa",
        type: "rent",
        amount: 8500.00,
        status: "completed",
        method: "Visa •••• 4242",
        receipt: "receipt_001.pdf"
    },
    {
        id: 2,
        date: "2023-06-15",
        description: "House Cleaning Service",
        type: "maintenance",
        amount: 120.00,
        status: "completed",
        method: "Mastercard •••• 5555",
        receipt: "receipt_002.pdf"
    },
    {
        id: 3,
        date: "2023-06-10",
        description: "Garden Maintenance",
        type: "maintenance",
        amount: 150.00,
        status: "completed",
        method: "Visa •••• 4242",
        receipt: "receipt_003.pdf"
    },
    {
        id: 4,
        date: "2023-06-01",
        description: "Monthly Rent - Luxury Villa",
        type: "rent",
        amount: 8500.00,
        status: "completed",
        method: "Visa •••• 4242",
        receipt: "receipt_004.pdf"
    },
    {
        id: 5,
        date: "2023-05-20",
        description: "Function Hall Reservation",
        type: "facilities",
        amount: 500.00,
        status: "completed",
        method: "Mastercard •••• 5555",
        receipt: "receipt_005.pdf"
    },
    {
        id: 6,
        date: "2023-05-01",
        description: "Monthly Rent - Luxury Villa",
        type: "rent",
        amount: 8500.00,
        status: "completed",
        method: "Visa •••• 4242",
        receipt: "receipt_006.pdf"
    },
    {
        id: 7,
        date: "2023-04-15",
        description: "Plumbing Repair",
        type: "maintenance",
        amount: 320.00,
        status: "pending",
        method: "Visa •••• 4242",
        receipt: "receipt_007.pdf"
    },
    {
        id: 8,
        date: "2023-04-01",
        description: "Monthly Rent - Luxury Villa",
        type: "rent",
        amount: 8500.00,
        status: "completed",
        method: "Visa •••• 4242",
        receipt: "receipt_008.pdf"
    },
    {
        id: 9,
        date: "2023-03-25",
        description: "Swimming Pool Maintenance",
        type: "maintenance",
        amount: 250.00,
        status: "failed",
        method: "Mastercard •••• 5555",
        receipt: "receipt_009.pdf"
    },
    {
        id: 10,
        date: "2023-03-01",
        description: "Monthly Rent - Luxury Villa",
        type: "rent",
        amount: 8500.00,
        status: "completed",
        method: "Visa •••• 4242",
        receipt: "receipt_010.pdf"
    }
];

// Sample spending data for the chart
const monthlySpending = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    rent: [8500, 8500, 8500, 8500, 8500, 8500, 8500, 0, 0, 0, 0, 0],
    maintenance: [120, 180, 250, 320, 150, 270, 120, 0, 0, 0, 0, 0],
    facilities: [0, 0, 0, 0, 500, 0, 0, 0, 0, 0, 0, 0]
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the spending chart
    initSpendingChart();
    
    // Load payment history
    loadPaymentHistory();
    
    // Set up filter event listeners
    document.getElementById('paymentType').addEventListener('change', filterHistory);
    document.getElementById('dateRange').addEventListener('change', filterHistory);
    document.getElementById('statusFilter').addEventListener('change', filterHistory);
    document.querySelector('.reset-filters').addEventListener('click', resetFilters);
    
    // Pagination buttons
    document.getElementById('prevPage').addEventListener('click', goToPreviousPage);
    document.getElementById('nextPage').addEventListener('click', goToNextPage);
    
    // Time filter for chart
    document.getElementById('timeFilter').addEventListener('change', updateChartTimeRange);
});

function initSpendingChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    window.spendingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthlySpending.labels,
            datasets: [
                {
                    label: 'Rent',
                    data: monthlySpending.rent,
                    backgroundColor: 'rgba(107, 68, 35, 0.8)',
                    borderColor: 'rgba(107, 68, 35, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Maintenance',
                    data: monthlySpending.maintenance,
                    backgroundColor: 'rgba(78, 121, 167, 0.8)',
                    borderColor: 'rgba(78, 121, 167, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                },
                {
                    label: 'Facilities',
                    data: monthlySpending.facilities,
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

function updateChartTimeRange() {
    const monthsToShow = parseInt(document.getElementById('timeFilter').value);
    const allLabels = monthlySpending.labels;
    const allRent = monthlySpending.rent;
    const allMaintenance = monthlySpending.maintenance;
    const allFacilities = monthlySpending.facilities;
    
    window.spendingChart.data.labels = allLabels.slice(-monthsToShow);
    window.spendingChart.data.datasets[0].data = allRent.slice(-monthsToShow);
    window.spendingChart.data.datasets[1].data = allMaintenance.slice(-monthsToShow);
    window.spendingChart.data.datasets[2].data = allFacilities.slice(-monthsToShow);
    window.spendingChart.update();
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
            <div class="item-receipt">
                <a href="/receipts/${payment.receipt}" target="_blank" class="receipt-link">
                    <i class="fas fa-file-pdf"></i> View
                </a>
            </div>
        `;
        
        container.appendChild(paymentItem);
    });
}

function filterHistory() {
    const typeFilter = document.getElementById('paymentType').value;
    const dateFilter = document.getElementById('dateRange').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredData = paymentHistory;
    
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
    
    loadPaymentHistory(filteredData);
}

function resetFilters() {
    document.getElementById('paymentType').value = 'all';
    document.getElementById('dateRange').value = 'all';
    document.getElementById('statusFilter').value = 'all';
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
        completed: 'Completed',
        pending: 'Pending',
        failed: 'Failed'
    };
    return statusNames[status] || status;
}

function getStatusIcon(status) {
    const statusIcons = {
        completed: 'fas fa-check-circle',
        pending: 'fas fa-clock',
        failed: 'fas fa-times-circle'
    };
    return statusIcons[status] || 'fas fa-info-circle';
}