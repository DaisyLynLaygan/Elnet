document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real app, this would come from an API
    const facilityTasks = [
        {
            id: "RES-2023-002",
            facility: "Sports Court",
            resident: "Maria Garcia (Unit 205)",
            dateTime: "16 Oct 2023, 09:00-11:00",
            status: "in-progress",
            purpose: "Badminton Tournament",
            assignedStaff: "Current Staff",
            details: {
                date: "16 Oct 2023",
                time: "09:00 - 11:00 (2 hours)",
                guests: "15 people",
                notes: "Make sure to check the equipment before the event"
            }
        },
        {
            id: "RES-2023-006",
            facility: "Sports Court",
            resident: "Emily Wilson (Unit 315)",
            dateTime: "20 Oct 2023, 15:00-17:00",
            status: "in-progress",
            purpose: "Basketball Game",
            assignedStaff: "Current Staff",
            details: {
                date: "20 Oct 2023",
                time: "15:00 - 17:00 (2 hours)",
                guests: "12 people",
                notes: "Need to set up scoreboard"
            }
        }
    ];

    const serviceTasks = [
        {
            id: "SR-2023-002",
            service: "Garden Maintenance",
            homeowner: "Priya Sharma (Unit 5C)",
            date: "26 Oct 2023",
            status: "in-progress",
            assignedStaff: "Current Staff",
            details: {
                scheduledTime: "02:00 PM",
                payment: "Paid",
                instructions: "Please trim the hedges along the front walkway and remove weeds from the flower beds. The lawn needs mowing as well."
            }
        },
        {
            id: "SR-2023-011",
            service: "HVAC Maintenance",
            homeowner: "James White (Unit 207)",
            date: "29 Oct 2023",
            status: "in-progress",
            assignedStaff: "Current Staff",
            details: {
                scheduledTime: "03:00 PM",
                payment: "Paid",
                instructions: "AC unit not cooling properly. Needs inspection and service."
            }
        }
    ];

    // Current selected task
    let currentTask = null;
    let isFacilityTask = false;

    // DOM Elements
    const facilityTasksTable = document.getElementById('facilityTasks');
    const serviceTasksTable = document.getElementById('serviceTasks');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const taskDetailsModal = document.getElementById('taskDetailsModal');
    const taskModalTitle = document.getElementById('taskModalTitle');
    const taskModalBody = document.getElementById('taskModalBody');
    const markTaskDoneBtn = document.getElementById('markTaskDoneBtn');
    const closeModalButtons = document.querySelectorAll('.close-modal, .close-modal-btn');

    // Initialize the page
    renderTasks();

    // Event Listeners
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderTasks(this.dataset.filter);
        });
    });

    markTaskDoneBtn.addEventListener('click', markTaskAsDone);

    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', closeTaskModal);
    });

    taskDetailsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeTaskModal();
        }
    });

    // Functions
    function renderTasks(filter = 'in-progress') {
        // Filter tasks based on status
        const filteredFacilityTasks = facilityTasks.filter(task => 
            filter === 'in-progress' ? task.status === 'in-progress' : task.status === 'completed'
        );

        const filteredServiceTasks = serviceTasks.filter(task => 
            filter === 'in-progress' ? task.status === 'in-progress' : task.status === 'completed'
        );

        // Render facility tasks
        facilityTasksTable.innerHTML = '';
        if (filteredFacilityTasks.length === 0) {
            facilityTasksTable.innerHTML = `
                <tr>
                    <td colspan="6" class="no-tasks">No ${filter} facility tasks found</td>
                </tr>
            `;
        } else {
            filteredFacilityTasks.forEach(task => {
                const row = document.createElement('tr');
                row.dataset.id = task.id;
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.facility}</td>
                    <td>${task.resident}</td>
                    <td>${task.dateTime}</td>
                    <td><span class="status-badge status-${task.status}">${formatStatus(task.status)}</span></td>
                    <td>
                        <button class="btn-icon view-details" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                facilityTasksTable.appendChild(row);
            });
        }

        // Render service tasks
        serviceTasksTable.innerHTML = '';
        if (filteredServiceTasks.length === 0) {
            serviceTasksTable.innerHTML = `
                <tr>
                    <td colspan="6" class="no-tasks">No ${filter} service tasks found</td>
                </tr>
            `;
        } else {
            filteredServiceTasks.forEach(task => {
                const row = document.createElement('tr');
                row.dataset.id = task.id;
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.service}</td>
                    <td>${task.homeowner}</td>
                    <td>${task.date}</td>
                    <td><span class="status-badge status-${task.status}">${formatStatus(task.status)}</span></td>
                    <td>
                        <button class="btn-icon view-details" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                serviceTasksTable.appendChild(row);
            });
        }

        // Add click event to view buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const taskId = this.closest('tr').dataset.id;
                const isFacility = this.closest('#facilityTasks') !== null;
                showTaskDetails(taskId, isFacility);
            });
        });

        // Add click event to rows
        document.querySelectorAll('#facilityTasks tr, #serviceTasks tr').forEach(row => {
            row.addEventListener('click', function() {
                const taskId = this.dataset.id;
                const isFacility = this.closest('#facilityTasks') !== null;
                showTaskDetails(taskId, isFacility);
            });
        });
    }

    function showTaskDetails(taskId, isFacility) {
        let task;
        if (isFacility) {
            task = facilityTasks.find(t => t.id === taskId);
            isFacilityTask = true;
        } else {
            task = serviceTasks.find(t => t.id === taskId);
            isFacilityTask = false;
        }

        if (!task) return;

        currentTask = task;

        // Update modal title
        taskModalTitle.textContent = isFacility ? 
            `Facility Reservation: ${task.id}` : 
            `Service Request: ${task.id}`;

        // Update modal body
        if (isFacility) {
            taskModalBody.innerHTML = `
                <div class="task-details">
                    <div class="detail-item">
                        <span class="detail-label">Facility:</span>
                        <span class="detail-value">${task.facility}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Resident:</span>
                        <span class="detail-value">${task.resident}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${task.details.date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${task.details.time}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Guests:</span>
                        <span class="detail-value">${task.details.guests}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Purpose:</span>
                        <span class="detail-value">${task.purpose}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Staff Notes:</span>
                        <span class="detail-value">${task.details.notes || 'None'}</span>
                    </div>
                </div>
            `;
        } else {
            taskModalBody.innerHTML = `
                <div class="task-details">
                    <div class="detail-item">
                        <span class="detail-label">Service:</span>
                        <span class="detail-value">${task.service}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Homeowner:</span>
                        <span class="detail-value">${task.homeowner}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Scheduled Date:</span>
                        <span class="detail-value">${task.date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Scheduled Time:</span>
                        <span class="detail-value">${task.details.scheduledTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Payment Status:</span>
                        <span class="detail-value">${task.details.payment}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Instructions:</span>
                        <span class="detail-value">${task.details.instructions}</span>
                    </div>
                </div>
            `;
        }

        // Show/hide mark as done button based on status
        markTaskDoneBtn.style.display = task.status === 'in-progress' ? 'block' : 'none';

        // Open modal
        taskDetailsModal.classList.add('active');
    }

    function markTaskAsDone() {
        if (!currentTask) return;

        // In a real app, you would make an API call here to update the task status
        currentTask.status = 'completed';

        // Show success message
        Swal.fire({
            title: 'Task Completed!',
            text: `The ${isFacilityTask ? 'facility reservation' : 'service request'} has been marked as completed.`,
            icon: 'success',
            confirmButtonColor: '#4CAF50',
        }).then(() => {
            // Refresh the tasks list and close modal
            const activeFilter = document.querySelector('.filter-tab.active').dataset.filter;
            renderTasks(activeFilter);
            closeTaskModal();
        });
    }

    function closeTaskModal() {
        taskDetailsModal.classList.remove('active');
        currentTask = null;
    }

    function formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
});