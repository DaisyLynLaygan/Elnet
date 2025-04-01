document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventsList = document.getElementById('eventsList');
    const eventModal = document.getElementById('eventModal');
    const eventDetailsModal = document.getElementById('eventDetailsModal');
    const eventDetailsContent = document.getElementById('eventDetailsContent');
    const eventForm = document.getElementById('eventForm');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const addEventBtn = document.getElementById('addEventBtn');
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    const eventsTableSection = document.getElementById('eventsTableSection');
    const eventsContent = document.getElementById('eventsContent');
    const eventsTableBody = document.querySelector('#eventsTable tbody');
    const participantModal = document.getElementById('participantModal');
    const participantForm = document.getElementById('participantForm');
    const participantTypeSelect = document.getElementById('participantType');
    const homeownerSelect = document.getElementById('homeownerSelect');
    const staffSelect = document.getElementById('staffSelect');
    const adminSelect = document.getElementById('adminSelect');
    const addParticipantBtn = document.getElementById('addParticipantBtn');
    const participantsList = document.getElementById('participantsList');
    const participantCount = document.getElementById('participantCount');
    const refreshBtn = document.getElementById('refreshEvents');

    // State
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedEventId = null;
    let uploadedImage = null;
    
    // Sample data
    const homeowners = [
        { id: 1, name: "John Smith", unit: "A101", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
        { id: 2, name: "Sarah Johnson", unit: "B205", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
        { id: 3, name: "Michael Brown", unit: "C302", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        { id: 4, name: "Emily Davis", unit: "D104", avatar: "https://randomuser.me/api/portraits/women/4.jpg" }
    ];

    const staffMembers = [
        { id: 1, name: "Robert Wilson", role: "Facility Manager", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
        { id: 2, name: "Jennifer Lee", role: "Event Coordinator", avatar: "https://randomuser.me/api/portraits/women/6.jpg" },
        { id: 3, name: "David Miller", role: "Security", avatar: "https://randomuser.me/api/portraits/men/7.jpg" }
    ];

    const admins = [
        { id: 1, name: "Admin One", role: "System Administrator", avatar: "https://randomuser.me/api/portraits/men/8.jpg" },
        { id: 2, name: "Admin Two", role: "Community Manager", avatar: "https://randomuser.me/api/portraits/women/9.jpg" }
    ];

    // Sample events data with participants
    const events = [
        {
            id: 1,
            title: "Community Spring Festival",
            date: new Date(currentYear, currentMonth, currentDate.getDate() + 2),
            startTime: "10:00",
            endTime: "16:00",
            location: "Central Park, Main Pavilion",
            description: "Join us for our annual spring celebration! Enjoy live music, food trucks, games for all ages, and local artisan vendors. Don't miss the flower arranging workshop at 2pm.",
            organizer: "Community Events Committee",
            contact: "events@ourcommunity.org",
            capacity: 200,
            rsvpCount: 143,
            tags: ["public", "family", "festival"],
            featured: true,
            image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            participants: [
                { type: "homeowner", id: 1 },
                { type: "homeowner", id: 2 },
                { type: "staff", id: 1 },
                { type: "admin", id: 1 }
            ]
        },
        {
            id: 2,
            title: "Tech Conference 2023",
            date: new Date(currentYear, currentMonth, currentDate.getDate() + 5),
            startTime: "09:00",
            endTime: "18:00",
            location: "Convention Center, Room 304",
            description: "A full-day conference featuring the latest in technology trends. Keynote speakers include industry leaders discussing AI, blockchain, and the future of work. Lunch and refreshments provided.",
            organizer: "Tech Community Group",
            contact: "tech@community.org",
            capacity: 150,
            rsvpCount: 112,
            tags: ["professional", "tech", "workshop"],
            featured: true,
            image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            participants: [
                { type: "homeowner", id: 3 },
                { type: "staff", id: 2 },
                { type: "admin", id: 2 }
            ]
        },
        {
            id: 3,
            title: "Yoga in the Park",
            date: new Date(currentYear, currentMonth, currentDate.getDate() + 7),
            startTime: "07:00",
            endTime: "08:30",
            location: "Riverside Park, South Lawn",
            description: "Start your day with a refreshing outdoor yoga session suitable for all levels. Bring your own mat and water bottle. In case of rain, check our website for updates.",
            organizer: "Wellness Collective",
            contact: "wellness@community.org",
            capacity: 50,
            rsvpCount: 32,
            tags: ["wellness", "outdoor", "fitness"],
            featured: false,
            image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            participants: [
                { type: "homeowner", id: 4 },
                { type: "staff", id: 3 }
            ]
        }
    ];

    // Check localStorage for view preference
    const savedView = localStorage.getItem('eventsView');
    if (savedView === 'participants') {
        showParticipantsView();
    } else {
        showCalendarView();
    }

    // Initialize the application
    function init() {
        renderCalendar();
        displayUpcomingEvents();
        setupEventListeners();
        
        // Force grid view
        eventsList.classList.add('grid-view');
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Month navigation
        prevMonthBtn.addEventListener('click', navigateMonth.bind(null, -1));
        nextMonthBtn.addEventListener('click', navigateMonth.bind(null, 1));
        
        // Modal functionality
        addEventBtn.addEventListener('click', openAddEventModal);
        
        const closeModalButtons = document.querySelectorAll('.close-modal, .btn-cancel');
        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeAllModals);
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === eventModal || event.target === eventDetailsModal || event.target === participantModal) {
                closeAllModals();
            }
        });
        
        // Form submissions
        eventForm.addEventListener('submit', handleEventFormSubmit);
        participantForm.addEventListener('submit', handleParticipantFormSubmit);
        
        // Image upload
        imageUpload.addEventListener('change', handleImageUpload);
        
        // View toggle
        viewToggleBtn.addEventListener('click', toggleParticipantsView);
        
        // Participant type change
        participantTypeSelect.addEventListener('change', handleParticipantTypeChange);
        
        // Add participant button
        addParticipantBtn.addEventListener('click', openAddParticipantModal);
        
        // Refresh button
        refreshBtn.addEventListener('click', function() {
            renderParticipantsTable();
        });
    }

    // Calendar functions
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Create day headers
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Today's date for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            const cellDate = new Date(currentYear, currentMonth, day);
            
            // Set day cell class based on date
            if (cellDate < today) {
                dayCell.className = 'calendar-day past';
            } else if (cellDate.getTime() === today.getTime()) {
                dayCell.className = 'calendar-day today';
            } else {
                dayCell.className = 'calendar-day future';
            }
            
            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            // Check if this date has events
            const dateEvents = events.filter(event => 
                event.date.getDate() === day && 
                event.date.getMonth() === currentMonth && 
                event.date.getFullYear() === currentYear
            );
            
            // Add event indicator if there are events
            if (dateEvents.length > 0) {
                const eventIndicator = document.createElement('div');
                eventIndicator.className = 'calendar-event-indicator';
                
                const eventCount = document.createElement('span');
                eventCount.className = 'event-count';
                eventCount.textContent = dateEvents.length;
                eventCount.setAttribute('aria-label', `${dateEvents.length} events`);
                eventIndicator.appendChild(eventCount);
                
                dayCell.appendChild(eventIndicator);
                dayCell.classList.add('has-events');
            }
            
            // Add click event to show events for this day
            dayCell.addEventListener('click', function() {
                if (!dayCell.classList.contains('past')) {
                    const dateEvents = events.filter(event => 
                        event.date.getDate() === day && 
                        event.date.getMonth() === currentMonth && 
                        event.date.getFullYear() === currentYear
                    );
                    
                    if (dateEvents.length > 0) {
                        showEventDetails(dateEvents[0]);
                    }
                }
            });
            
            calendarGrid.appendChild(dayCell);
        }
    }

    function navigateMonth(offset) {
        currentMonth += offset;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    }

    // Events list functions
    function displayUpcomingEvents() {
        eventsList.innerHTML = '';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcomingEvents = events.filter(event => event.date >= today);
        
        if (upcomingEvents.length === 0) {
            eventsList.innerHTML = '<div class="no-events-message"><i class="far fa-calendar-plus"></i><p>No upcoming events scheduled</p></div>';
            return;
        }
        
        const sortedEvents = [...upcomingEvents].sort((a, b) => a.date - b.date);
        sortedEvents.forEach(event => {
            eventsList.appendChild(createEventCard(event));
        });
    }

    function createEventCard(event) {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        if (event.featured) {
            eventCard.classList.add('featured');
        }
        
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const eventMonth = monthNames[event.date.getMonth()];
        
        // Format date status
        let dateStatus = `${event.date.getDate()} ${eventMonth}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (event.date.getTime() === today.getTime()) {
            dateStatus = "Today";
        } else if (event.date.getTime() === today.getTime() + 86400000) {
            dateStatus = "Tomorrow";
        }
        
        // Calculate attendance percentage
        const attendancePercentage = Math.min(Math.round((event.rsvpCount / event.capacity) * 100), 100);
        
        eventCard.innerHTML = `
            <div class="event-image-container">
                ${event.image ? `<div class="event-image" style="background-image: url('${event.image}')"></div>` : ''}
            </div>
            <div class="event-details-container">
                <div class="event-date">
                    <span class="event-day">${event.date.getDate()}</span>
                    <span class="event-month">${eventMonth}</span>
                    <span class="event-date-status">${dateStatus}</span>
                </div>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    <p class="event-time"><i class="far fa-clock"></i> ${formatTime(event.startTime)} - ${formatTime(event.endTime)}</p>
                    <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location.split(',')[0]}</p>
                    
                    <div class="attendance-info">
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${attendancePercentage}%"></div>
                        </div>
                        <span class="spots-remaining">
                            ${event.rsvpCount}/${event.capacity} RSVPs
                        </span>
                    </div>
                    
                    <div class="event-tags">
                        ${event.tags.map(tag => `<span class="tag ${tag}">${capitalizeFirstLetter(tag)}</span>`).join('')}
                        ${event.featured ? '<span class="tag featured">Featured</span>' : ''}
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn-action participants" title="View Participants"><i class="fas fa-users"></i></button>
                    <button class="btn-action edit" title="Edit Event"><i class="fas fa-edit"></i></button>
                    <button class="btn-action delete" title="Delete Event"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        // Add event listeners to action buttons
        const participantsBtn = eventCard.querySelector('.participants');
        const editBtn = eventCard.querySelector('.edit');
        const deleteBtn = eventCard.querySelector('.delete');
        
        participantsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showEventDetails(event);
            showParticipantsView();
        });
        
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(event);
        });
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this event?')) {
                const index = events.findIndex(e => e.id === event.id);
                if (index !== -1) {
                    events.splice(index, 1);
                    renderCalendar();
                    displayUpcomingEvents();
                    renderParticipantsTable();
                }
            }
        });
        
        // Click event to show details
        eventCard.addEventListener('click', function(e) {
            if (!e.target.closest('.event-actions')) {
                showEventDetails(event);
            }
        });
        
        return eventCard;
    }

    // Event details functions
    function showEventDetails(event) {
        selectedEventId = event.id;
        
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        const eventMonth = monthNames[event.date.getMonth()];
        
        // Format date status
        let dateStatus = `${eventMonth} ${event.date.getDate()}, ${event.date.getFullYear()}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (event.date.getTime() === today.getTime()) {
            dateStatus = "Today";
        } else if (event.date.getTime() === today.getTime() + 86400000) {
            dateStatus = "Tomorrow";
        }
        
        // Calculate spots remaining
        const spotsRemaining = event.capacity - event.rsvpCount;
        const spotsText = spotsRemaining > 0 ? 
            `${spotsRemaining} spot${spotsRemaining === 1 ? '' : 's'} remaining` : 
            'Event full';
        
        eventDetailsContent.innerHTML = `
            <div class="event-header">
                ${event.image ? `<div class="event-image" style="background-image: url('${event.image}')"></div>` : ''}
                <div class="event-title-container">
                    <h2>${event.title}</h2>
                    <div class="event-meta">
                        <span class="event-date"><i class="far fa-calendar"></i> ${dateStatus}</span>
                        <span class="event-time"><i class="far fa-clock"></i> ${formatTime(event.startTime)} - ${formatTime(event.endTime)}</span>
                    </div>
                </div>
            </div>
            
            <div class="event-body">
                <div class="event-details">
                    <div class="detail-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h4>Location</h4>
                            <p>${event.location}</p>
                        </div>
                    </div>
                    
                    <div class="detail-row">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <h4>Description</h4>
                            <p>${event.description}</p>
                        </div>
                    </div>
                    
                    <div class="detail-row">
                        <i class="fas fa-user-friends"></i>
                        <div>
                            <h4>Organizer</h4>
                            <p>${event.organizer}</p>
                            ${event.contact ? `<p class="contact"><i class="fas fa-envelope"></i> ${event.contact}</p>` : ''}
                        </div>
                    </div>
                    
                    <div class="event-tags">
                        ${event.tags.map(tag => `<span class="tag ${tag}">${capitalizeFirstLetter(tag)}</span>`).join('')}
                    </div>
                </div>
                
                <div class="event-actions">
                    <div class="attendance-info">
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${(event.rsvpCount / event.capacity) * 100}%"></div>
                        </div>
                        <span class="spots-remaining ${spotsRemaining === 0 ? 'full' : ''}">
                            ${spotsText} (${event.rsvpCount}/${event.capacity})
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        // Show participants section
        showParticipants(event);
        
        eventDetailsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function showParticipants(event) {
        participantsList.innerHTML = '';
        participantCount.textContent = event.participants.length;
        
        if (event.participants.length === 0) {
            participantsList.innerHTML = '<p class="no-participants">No participants yet</p>';
            return;
        }
        
        // Create legend
        const legend = document.createElement('div');
        legend.className = 'participant-legend';
        legend.innerHTML = `
            <div class="legend-item">
                <span class="legend-color homeowner"></span>
                <span>Homeowner</span>
            </div>
            <div class="legend-item">
                <span class="legend-color staff"></span>
                <span>Staff</span>
            </div>
            <div class="legend-item">
                <span class="legend-color admin"></span>
                <span>Admin</span>
            </div>
        `;
        participantsList.appendChild(legend);
        
        // Create participants list
        const participantsContainer = document.createElement('div');
        participantsContainer.className = 'participants-container';
        
        event.participants.forEach(participant => {
            let person;
            let typeText;
            let typeClass;
            
            if (participant.type === 'homeowner') {
                person = homeowners.find(h => h.id === participant.id);
                typeText = `Unit ${person.unit}`;
                typeClass = 'homeowner';
            } else if (participant.type === 'staff') {
                person = staffMembers.find(s => s.id === participant.id);
                typeText = `${person.role}`;
                typeClass = 'staff';
            } else if (participant.type === 'admin') {
                person = admins.find(a => a.id === participant.id);
                typeText = `${person.role}`;
                typeClass = 'admin';
            }
            
            if (person) {
                const participantCard = document.createElement('div');
                participantCard.className = `participant-card ${typeClass}`;
                participantCard.innerHTML = `
                    <div class="participant-avatar">
                        ${person.avatar ? `<img src="${person.avatar}" alt="${person.name}">` : `<i class="fas fa-user"></i>`}
                    </div>
                    <div class="participant-info">
                        <div class="participant-name">${person.name}</div>
                        <div class="participant-type">
                            <i class="fas ${participant.type === 'homeowner' ? 'fa-home' : 
                                           participant.type === 'staff' ? 'fa-briefcase' : 'fa-user-shield'}"></i>
                            ${typeText}
                        </div>
                    </div>
                    <div class="participant-actions">
                        <button class="btn-remove-participant" data-type="${participant.type}" data-id="${participant.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                
                participantsContainer.appendChild(participantCard);
            }
        });
        
        participantsList.appendChild(participantsContainer);
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.btn-remove-participant').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.dataset.type;
                const id = parseInt(this.dataset.id);
                
                if (confirm('Remove this participant from the event?')) {
                    const eventIndex = events.findIndex(e => e.id === selectedEventId);
                    if (eventIndex !== -1) {
                        const participantIndex = events[eventIndex].participants.findIndex(
                            p => p.type === type && p.id === id
                        );
                        
                        if (participantIndex !== -1) {
                            events[eventIndex].participants.splice(participantIndex, 1);
                            showParticipants(events[eventIndex]);
                            renderParticipantsTable();
                        }
                    }
                }
            });
        });
    }

    // View toggle functions
    function toggleParticipantsView() {
        if (eventsTableSection.style.display === 'none') {
            showParticipantsView();
        } else {
            showCalendarView();
        }
    }

    function showParticipantsView() {
        eventsTableSection.style.display = 'block';
        eventsContent.style.display = 'none';
        viewToggleBtn.innerHTML = '<i class="fas fa-calendar"></i> <span class="btn-text">Show Calendar View</span>';
        renderParticipantsTable();
        localStorage.setItem('eventsView', 'participants');
    }

    function showCalendarView() {
        eventsTableSection.style.display = 'none';
        eventsContent.style.display = 'grid';
        viewToggleBtn.innerHTML = '<i class="fas fa-users"></i> <span class="btn-text">Show Participants</span>';
        localStorage.setItem('eventsView', 'calendar');
    }

    // Participants table view functions
    function renderParticipantsTable() {
        eventsTableBody.innerHTML = '';
        
        // Create a header row
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Event</th>
            <th>Date</th>
            <th>Participants</th>
            <th>Homeowners</th>
            <th>Staff</th>
            <th>Admins</th>
            <th>Actions</th>
        `;
        eventsTableBody.appendChild(headerRow);
        
        // Sort events by date
        const sortedEvents = [...events].sort((a, b) => a.date - b.date);
        
        sortedEvents.forEach(event => {
            const row = document.createElement('tr');
            
            // Count participants by type
            const homeownerCount = event.participants.filter(p => p.type === 'homeowner').length;
            const staffCount = event.participants.filter(p => p.type === 'staff').length;
            const adminCount = event.participants.filter(p => p.type === 'admin').length;
            
            // Format date
            const eventDate = event.date.toLocaleDateString();
            
            row.innerHTML = `
                <td>${event.title}</td>
                <td>${eventDate}</td>
                <td>${event.participants.length}</td>
                <td>${homeownerCount}</td>
                <td>${staffCount}</td>
                <td>${adminCount}</td>
                <td class="actions">
                    <button class="btn-action view" title="View Participants"><i class="fas fa-users"></i></button>
                    <button class="btn-action edit" title="Edit Event"><i class="fas fa-edit"></i></button>
                </td>
            `;
            
            // Add event listeners to action buttons
            const viewBtn = row.querySelector('.view');
            const editBtn = row.querySelector('.edit');
            
            viewBtn.addEventListener('click', () => {
                showEventDetails(event);
                showParticipantsView();
            });
            
            editBtn.addEventListener('click', () => openEditModal(event));
            
            eventsTableBody.appendChild(row);
        });
    }

    // Modal functions
    function openAddEventModal() {
        selectedEventId = null;
        document.getElementById('modalTitle').textContent = 'Add New Event';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('eventDate').min = today;
        document.getElementById('eventForm').reset();
        imagePreview.style.display = 'none';
        uploadedImage = null;
        eventModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function openEditModal(event) {
        selectedEventId = event.id;
        document.getElementById('modalTitle').textContent = 'Edit Event';
        
        // Fill form with event data
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventImage').value = event.image || '';
        
        const formattedDate = `${event.date.getFullYear()}-${(event.date.getMonth() + 1).toString().padStart(2, '0')}-${event.date.getDate().toString().padStart(2, '0')}`;
        document.getElementById('eventDate').value = formattedDate;
        
        document.getElementById('startTime').value = event.startTime;
        document.getElementById('endTime').value = event.endTime;
        document.getElementById('eventLocation').value = event.location;
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('eventCapacity').value = event.capacity;
        document.getElementById('eventOrganizer').value = event.organizer || '';
        document.getElementById('eventContact').value = event.contact || '';
        
        // Clear all tag checkboxes
        document.querySelectorAll('.tag-option input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Check the tags that apply
        event.tags.forEach(tag => {
            const checkbox = document.querySelector(`.tag-option input[value="${tag}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        document.getElementById('featuredEvent').checked = event.featured;
        
        // Show image preview if exists
        if (event.image) {
            previewImage.src = event.image;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }
        
        eventModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function openAddParticipantModal() {
        // Populate homeowner select
        homeownerSelect.innerHTML = '';
        homeowners.forEach(homeowner => {
            const option = document.createElement('option');
            option.value = homeowner.id;
            option.textContent = `${homeowner.name} (Unit ${homeowner.unit})`;
            homeownerSelect.appendChild(option);
        });
        
        // Populate staff select
        staffSelect.innerHTML = '';
        staffMembers.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.id;
            option.textContent = `${staff.name} (${staff.role})`;
            staffSelect.appendChild(option);
        });
        
        // Populate admin select
        adminSelect.innerHTML = '';
        admins.forEach(admin => {
            const option = document.createElement('option');
            option.value = admin.id;
            option.textContent = `${admin.name} (${admin.role})`;
            adminSelect.appendChild(option);
        });
        
        // Reset form
        participantForm.reset();
        document.getElementById('homeownerSelectGroup').style.display = 'none';
        document.getElementById('staffSelectGroup').style.display = 'none';
        document.getElementById('adminSelectGroup').style.display = 'none';
        
        participantModal.style.display = 'flex';
    }

    function closeAllModals() {
        eventModal.style.display = 'none';
        eventDetailsModal.style.display = 'none';
        participantModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Form handling
    function handleEventFormSubmit(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const location = document.getElementById('eventLocation').value;
        const description = document.getElementById('eventDescription').value;
        const capacity = parseInt(document.getElementById('eventCapacity').value);
        const organizer = document.getElementById('eventOrganizer').value;
        const contact = document.getElementById('eventContact').value;
        const imageUrl = document.getElementById('eventImage').value || uploadedImage;
        
        // Get selected tags
        const tags = [];
        document.querySelectorAll('.tag-option input:checked').forEach(checkbox => {
            tags.push(checkbox.value);
        });
        
        const featured = document.getElementById('featuredEvent').checked;
        
        // Create/update event object
        const eventData = {
            id: selectedEventId || events.length + 1,
            title,
            date: new Date(date),
            startTime,
            endTime,
            location,
            description,
            capacity,
            organizer,
            contact,
            tags,
            featured,
            rsvpCount: selectedEventId ? events.find(e => e.id === selectedEventId).rsvpCount : 0,
            image: imageUrl,
            participants: selectedEventId ? events.find(e => e.id === selectedEventId).participants : []
        };
        
        // Only add future events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventData.date >= today) {
            if (selectedEventId) {
                // Update existing event
                const index = events.findIndex(e => e.id === selectedEventId);
                if (index !== -1) {
                    events[index] = eventData;
                }
            } else {
                // Add new event
                events.push(eventData);
            }
            
            // Update UI
            renderCalendar();
            displayUpcomingEvents();
            renderParticipantsTable();
            
            // Close modal
            closeAllModals();
        } else {
            alert('Please select a current or future date for the event.');
        }
    }

    function handleParticipantFormSubmit(e) {
        e.preventDefault();
        
        const type = participantTypeSelect.value;
        let id;
        
        if (type === 'homeowner') {
            id = parseInt(homeownerSelect.value);
        } else if (type === 'staff') {
            id = parseInt(staffSelect.value);
        } else if (type === 'admin') {
            id = parseInt(adminSelect.value);
        } else {
            alert('Please select participant type');
            return;
        }
        
        // Check if participant already exists
        const eventIndex = events.findIndex(e => e.id === selectedEventId);
        if (eventIndex !== -1) {
            const exists = events[eventIndex].participants.some(
                p => p.type === type && p.id === id
            );
            
            if (exists) {
                alert('This person is already a participant');
                return;
            }
            
            // Add new participant
            events[eventIndex].participants.push({ type, id });
            showParticipants(events[eventIndex]);
            renderParticipantsTable();
            closeAllModals();
        }
    }

    function handleParticipantTypeChange() {
        document.getElementById('homeownerSelectGroup').style.display = 'none';
        document.getElementById('staffSelectGroup').style.display = 'none';
        document.getElementById('adminSelectGroup').style.display = 'none';
        
        if (this.value === 'homeowner') {
            document.getElementById('homeownerSelectGroup').style.display = 'block';
        } else if (this.value === 'staff') {
            document.getElementById('staffSelectGroup').style.display = 'block';
        } else if (this.value === 'admin') {
            document.getElementById('adminSelectGroup').style.display = 'block';
        }
    }

    function handleImageUpload(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                previewImage.src = event.target.result;
                imagePreview.style.display = 'block';
                uploadedImage = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    }

    // Helper functions
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Global function for image removal
    window.removeImage = function() {
        previewImage.src = '#';
        imagePreview.style.display = 'none';
        document.getElementById('eventImage').value = '';
        imageUpload.value = '';
        uploadedImage = null;
    };

    // Initialize the application
    init();
});