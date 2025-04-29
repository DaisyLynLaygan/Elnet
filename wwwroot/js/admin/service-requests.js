// WebSocket connection for real-time updates
let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // 5 seconds

// Filter and pagination state
let currentFilters = {
    status: 'all',
    serviceType: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    startDate: null,
    endDate: null
};
let currentPage = 1;
let totalPages = 1;

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const host = window.location.host;
    socket = new WebSocket(`${protocol}${host}/ws/admin/service-requests`);

    socket.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts = 0;
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };

    socket.onclose = () => {
        console.log('WebSocket disconnected');
        if (reconnectAttempts < maxReconnectAttempts) {
            setTimeout(connectWebSocket, reconnectDelay);
            reconnectAttempts++;
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'new_request':
            addNewRequest(data.request);
            updateStats();
            break;
        case 'request_updated':
            updateRequest(data.request);
            updateStats();
            break;
        case 'request_deleted':
            removeRequest(data.requestId);
            updateStats();
            break;
    }
}

// Modal management
const serviceRequestModal = document.getElementById('serviceRequestModal');
const rejectionModal = document.getElementById('rejectionModal');
let currentRequestId = null;

function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
window.onclick = (event) => {
    if (event.target === serviceRequestModal) {
        closeModal(serviceRequestModal);
    }
    if (event.target === rejectionModal) {
        closeModal(rejectionModal);
    }
};

// Close modals when clicking close buttons
document.querySelectorAll('.close-modal').forEach(button => {
    button.onclick = () => {
        closeModal(serviceRequestModal);
        closeModal(rejectionModal);
    };
});

// Load service requests with current filters and pagination
async function loadServiceRequests() {
    try {
        const queryParams = new URLSearchParams({
            page: currentPage,
            status: currentFilters.status,
            serviceType: currentFilters.serviceType,
            paymentStatus: currentFilters.paymentStatus,
            dateRange: currentFilters.dateRange,
            startDate: currentFilters.startDate || '',
            endDate: currentFilters.endDate || ''
        });

        const response = await fetch(`/Admin/GetServiceRequests?${queryParams}`);
        const data = await response.json();

        if (data.success) {
            updateServiceRequestsTable(data.requests);
            updatePagination(data.pagination);
            updateStats(data.stats);
        } else {
            showError(data.message || 'Failed to load service requests');
        }
    } catch (error) {
        console.error('Error loading service requests:', error);
        showError('Failed to load service requests');
    }
}

// Update service requests table
function updateServiceRequestsTable(requests) {
    const tbody = document.getElementById('serviceRequestsTableBody');
    if (!tbody) return;

    tbody.innerHTML = requests.map(request => `
        <tr>
            <td>#SR-${request.request_id}</td>
            <td>
                <div class="user-info">
                    <div class="user-avatar">${request.user.firstname.charAt(0)}${request.user.lastname.charAt(0)}</div>
                    <div class="user-details">
                        <h4>${request.user.firstname} ${request.user.lastname}</h4>
                        <p>${request.user.email}</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="service-info">
                    <div class="service-icon">${request.service_icon}</div>
                    <span>${request.service_type}</span>
                </div>
            </td>
            <td>
                <div class="date-time">
                    <div class="date">${new Date(request.scheduled_date).toLocaleDateString()}</div>
                    <div class="time">${request.scheduled_time}</div>
                </div>
            </td>
            <td><span class="badge ${getStatusClass(request.status)}">${request.status}</span></td>
            <td><span class="badge ${request.payment_status === 'Paid' ? 'success' : 'danger'}">${request.payment_status}</span></td>
            <td>
                <button class="btn-icon view-details" title="View Details" data-id="${request.request_id}">
                    <i class="fas fa-eye"></i>
                </button>
                ${request.status === 'Pending Approval' ? `
                    <button class="btn-icon approve-request" title="Approve" data-id="${request.request_id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon reject-request" title="Reject" data-id="${request.request_id}">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
                ${request.status === 'Approved' && request.payment_status === 'Unpaid' ? `
                    <button class="btn-icon mark-paid" title="Mark as Paid" data-id="${request.request_id}">
                        <i class="fas fa-dollar-sign"></i>
                    </button>
                ` : ''}
                ${request.status === 'Approved' && request.payment_status === 'Paid' ? `
                    <button class="btn-icon mark-complete" title="Mark as Complete" data-id="${request.request_id}">
                        <i class="fas fa-check-double"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');

    // Add event listeners to the new buttons
    addEventListeners();
}

// Update pagination
function updatePagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    totalPages = pagination.totalPages;
    currentPage = pagination.currentPage;

    let paginationHTML = '';

    if (currentPage > 1) {
        paginationHTML += `
            <button class="pagination-btn" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i> Previous
            </button>
        `;
    }

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }

    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="pagination-btn" data-page="${currentPage + 1}">
                Next <i class="fas fa-chevron-right"></i>
            </button>
        `;
    }

    paginationContainer.innerHTML = paginationHTML;

    // Add event listeners to pagination buttons
    document.querySelectorAll('.pagination-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentPage = parseInt(this.getAttribute('data-page'));
            loadServiceRequests();
        });
    });
}

// Update stats
function updateStats(stats) {
    if (!stats) return;

    const totalRequests = document.getElementById('totalRequests');
    const pendingRequests = document.getElementById('pendingRequests');
    const unpaidRequests = document.getElementById('unpaidRequests');
    const completedRequests = document.getElementById('completedRequests');

    if (totalRequests) totalRequests.textContent = stats.total;
    if (pendingRequests) pendingRequests.textContent = stats.pending;
    if (unpaidRequests) unpaidRequests.textContent = stats.unpaid;
    if (completedRequests) completedRequests.textContent = stats.completed;
}

// Get status class for badge
function getStatusClass(status) {
    switch(status) {
        case 'Pending Approval': return 'warning';
        case 'Approved': return 'primary';
        case 'Rejected': return 'danger';
        case 'Completed': return 'success';
        default: return 'secondary';
    }
}

// Initialize filters
function initializeFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const serviceTypeFilter = document.getElementById('serviceTypeFilter');
    const paymentFilter = document.getElementById('paymentFilter');
    const dateFilter = document.getElementById('dateFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const customDateRange = document.getElementById('customDateRange');

    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            currentPage = 1;
            loadServiceRequests();
        });
    }

    if (serviceTypeFilter) {
        serviceTypeFilter.addEventListener('change', function() {
            currentFilters.serviceType = this.value;
            currentPage = 1;
            loadServiceRequests();
        });
    }

    if (paymentFilter) {
        paymentFilter.addEventListener('change', function() {
            currentFilters.paymentStatus = this.value;
            currentPage = 1;
            loadServiceRequests();
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            currentFilters.dateRange = this.value;
            if (this.value === 'custom') {
                customDateRange.style.display = 'flex';
            } else {
                customDateRange.style.display = 'none';
                currentFilters.startDate = null;
                currentFilters.endDate = null;
                currentPage = 1;
                loadServiceRequests();
            }
        });
    }

    if (startDate) {
        startDate.addEventListener('change', function() {
            currentFilters.startDate = this.value;
            if (currentFilters.endDate) {
                currentPage = 1;
                loadServiceRequests();
            }
        });
    }

    if (endDate) {
        endDate.addEventListener('change', function() {
            currentFilters.endDate = this.value;
            if (currentFilters.startDate) {
                currentPage = 1;
                loadServiceRequests();
            }
        });
    }
}

// Add event listeners to table buttons
function addEventListeners() {
    // View details button click
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', async function() {
            const requestId = this.getAttribute('data-id');
            try {
                const response = await fetch(`/Admin/GetServiceRequest/${requestId}`);
                const data = await response.json();
                
                if (data.success) {
                    const request = data.request;
                    const modalBody = document.querySelector('.modal-body .request-detail');
                    
                    if (modalBody) {
                        modalBody.innerHTML = `
                            <div class="request-header">
                                <div class="request-id">#SR-${request.request_id}</div>
                                <div class="request-status">
                                    <span class="badge ${getStatusClass(request.status)}">${request.status}</span>
                                </div>
                            </div>
                            
                            <div class="request-content">
                                <div class="request-section">
                                    <h4>Homeowner Information</h4>
                                    <div class="request-user">
                                        <div class="user-avatar">${request.user.firstname.charAt(0)}${request.user.lastname.charAt(0)}</div>
                                        <div class="user-details">
                                            <h4>${request.user.firstname} ${request.user.lastname}</h4>
                                            <p>${request.user.email}</p>
                                            <div class="user-contact">
                                                <i class="fas fa-phone"></i> ${request.user.contact_no || 'N/A'}<br>
                                                <i class="fas fa-envelope"></i> ${request.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="request-section">
                                    <h4>Service Details</h4>
                                    <div class="service-info">
                                        <div class="service-icon">${request.service_icon}</div>
                                        <div class="service-details">
                                            <h4>${request.service_type}</h4>
                                            <div class="service-meta">
                                                <span><strong>Price:</strong> $${request.price.toFixed(2)}</span>
                                                <span><strong>Frequency:</strong> ${request.frequency}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="request-section">
                                    <h4>Request Information</h4>
                                    <div class="request-meta">
                                        <div class="meta-item">
                                            <label>Request Date:</label>
                                            <span>${new Date(request.date_created).toLocaleDateString()}</span>
                                        </div>
                                        <div class="meta-item">
                                            <label>Scheduled Date:</label>
                                            <span>${new Date(request.scheduled_date).toLocaleDateString()}</span>
                                        </div>
                                        <div class="meta-item">
                                            <label>Scheduled Time:</label>
                                            <span>${request.scheduled_time}</span>
                                        </div>
                                        <div class="meta-item">
                                            <label>Payment Status:</label>
                                            <span class="badge ${request.payment_status === 'Paid' ? 'success' : 'danger'}">${request.payment_status}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="request-section">
                                    <h4>Special Instructions</h4>
                                    <div class="special-instructions">
                                        ${request.notes || 'No special instructions provided.'}
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        // Show/hide action buttons based on status
                        const approveRequestBtn = document.getElementById('approveRequestBtn');
                        const rejectRequestBtn = document.getElementById('rejectRequestBtn');
                        const markPaidBtn = document.getElementById('markPaidBtn');
                        const markCompleteBtn = document.getElementById('markCompleteBtn');
                        
                        if (approveRequestBtn) approveRequestBtn.style.display = 'none';
                        if (rejectRequestBtn) rejectRequestBtn.style.display = 'none';
                        if (markPaidBtn) markPaidBtn.style.display = 'none';
                        if (markCompleteBtn) markCompleteBtn.style.display = 'none';
                        
                        if (request.status === 'Pending Approval') {
                            if (approveRequestBtn) approveRequestBtn.style.display = 'inline-block';
                            if (rejectRequestBtn) rejectRequestBtn.style.display = 'inline-block';
                        } else if (request.status === 'Approved' && request.payment_status === 'Unpaid') {
                            if (markPaidBtn) markPaidBtn.style.display = 'inline-block';
                        } else if (request.status === 'Approved' && request.payment_status === 'Paid') {
                            if (markCompleteBtn) markCompleteBtn.style.display = 'inline-block';
                        }
                        
                        // Open modal
                        const modal = document.getElementById('serviceRequestModal');
                        if (modal) {
                            modal.style.display = 'flex';
                            document.body.style.overflow = 'hidden';
                            document.body.classList.add('modal-open');
                        }
                    }
                } else {
                    showError(data.message || 'Failed to load service request details');
                }
            } catch (error) {
                console.error('Error loading service request:', error);
                showError('Failed to load service request details');
            }
        });
    });

    // Approve Request
    document.querySelectorAll('.approve-request').forEach(button => {
        button.addEventListener('click', async () => {
            const requestId = button.dataset.id;
            await approveRequest(requestId);
        });
    });

    // Reject Request
    document.querySelectorAll('.reject-request').forEach(button => {
        button.addEventListener('click', () => {
            const requestId = button.dataset.id;
            showRejectionModal(requestId);
        });
    });

    // Mark as Paid
    document.querySelectorAll('.mark-paid').forEach(button => {
        button.addEventListener('click', async () => {
            const requestId = button.dataset.id;
            await markRequestAsPaid(requestId);
        });
    });

    // Mark as Complete
    document.querySelectorAll('.mark-complete').forEach(button => {
        button.addEventListener('click', async () => {
            const requestId = button.dataset.id;
            await markRequestAsComplete(requestId);
        });
    });
}

// API Calls
async function approveRequest(requestId) {
    try {
        const response = await fetch(`/Admin/ApproveServiceRequest/${requestId}`, {
            method: 'POST'
        });

        if (response.ok) {
            showSuccess('Service request approved successfully');
            closeModal(serviceRequestModal);
            loadServiceRequests();
        } else {
            throw new Error('Failed to approve request');
        }
    } catch (error) {
        console.error('Error approving request:', error);
        showError('Failed to approve service request');
    }
}

function showRejectionModal(requestId) {
    currentRequestId = requestId;
    openModal(rejectionModal);
}

async function confirmRejection() {
    const reason = document.getElementById('rejectionReason').value;
    const customReason = document.getElementById('customReason').value;
    
    if (!reason) {
        showError('Please select a reason for rejection');
        return;
    }

    if (reason === 'other' && !customReason) {
        showError('Please specify the reason for rejection');
        return;
    }

    try {
        const response = await fetch(`/Admin/RejectServiceRequest/${currentRequestId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reason: reason === 'other' ? customReason : reason
            })
        });

        if (response.ok) {
            showSuccess('Service request rejected successfully');
            closeModal(rejectionModal);
            loadServiceRequests();
        } else {
            throw new Error('Failed to reject request');
        }
    } catch (error) {
        console.error('Error rejecting request:', error);
        showError('Failed to reject service request');
    }
}

async function markRequestAsPaid(requestId) {
    try {
        const response = await fetch(`/Admin/MarkServiceRequestAsPaid/${requestId}`, {
            method: 'POST'
        });

        if (response.ok) {
            showSuccess('Service request marked as paid');
            closeModal(serviceRequestModal);
            loadServiceRequests();
        } else {
            throw new Error('Failed to mark request as paid');
        }
    } catch (error) {
        console.error('Error marking request as paid:', error);
        showError('Failed to mark service request as paid');
    }
}

async function markRequestAsComplete(requestId) {
    try {
        const response = await fetch(`/Admin/MarkServiceRequestAsComplete/${requestId}`, {
            method: 'POST'
        });

        if (response.ok) {
            showSuccess('Service request marked as complete');
            closeModal(serviceRequestModal);
            loadServiceRequests();
        } else {
            throw new Error('Failed to mark request as complete');
        }
    } catch (error) {
        console.error('Error marking request as complete:', error);
        showError('Failed to mark service request as complete');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getPaymentClass(status) {
    return status === 'Paid' ? 'status-paid' : 'status-unpaid';
}

// Notification functions
function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        timer: 3000,
        showConfirmButton: false
    });
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();
    initializeFilters();
    loadServiceRequests();
    
    // Add event listeners for modal buttons
    document.getElementById('approveRequestBtn').addEventListener('click', () => approveRequest(currentRequestId));
    document.getElementById('rejectRequestBtn').addEventListener('click', () => showRejectionModal(currentRequestId));
    document.getElementById('markPaidBtn').addEventListener('click', () => markRequestAsPaid(currentRequestId));
    document.getElementById('markCompleteBtn').addEventListener('click', () => markRequestAsComplete(currentRequestId));
    document.getElementById('confirmRejectionBtn').addEventListener('click', confirmRejection);
    
    // Add event listener for rejection reason selection
    document.getElementById('rejectionReason').addEventListener('change', (e) => {
        const customReasonGroup = document.getElementById('customReasonGroup');
        customReasonGroup.style.display = e.target.value === 'other' ? 'block' : 'none';
    });
});
