document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Set active menu item based on current path
    const currentPath = window.location.pathname.toLowerCase();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const linkPath = link.getAttribute('href').toLowerCase();
            if (currentPath === linkPath || 
                (currentPath.startsWith(linkPath) && linkPath !== '/')) {
                item.classList.add('active');
            }
        }
    });
    
    // User profile dropdown - persistent toggle
    const userProfile = document.querySelector('.user-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    let isDropdownOpen = false;
    
    if (userProfile) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            isDropdownOpen = !isDropdownOpen;
            
            if (isDropdownOpen) {
                this.classList.add('active');
                profileDropdown.style.display = 'block';
            } else {
                this.classList.remove('active');
                profileDropdown.style.display = 'none';
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userProfile.contains(e.target)) {
                isDropdownOpen = false;
                userProfile.classList.remove('active');
                profileDropdown.style.display = 'none';
            }
        });
        
        // Prevent dropdown from closing when clicking inside it
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});