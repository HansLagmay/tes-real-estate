// TES Real Estate - Utility Functions

// Format currency in Philippine Peso
function formatCurrency(amount) {
    return '₱' + amount.toLocaleString('en-PH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Format date to readable format
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format date to short format
function formatDateShort(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Get time ago format
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (let [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }
    
    return 'just now';
}

// Generate unique booking ID
function generateBookingId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TES-${year}-${month}-${random}`;
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password strength
function validatePassword(password) {
    // Minimum 8 characters, at least 1 uppercase, 1 number
    const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
}

// Validate Philippine phone number
function validatePhone(phone) {
    const re = /^\d{10,11}$/;
    return re.test(phone.replace(/\D/g, ''));
}

// Show error message
function showError(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    inputElement.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Hide error message
function hideError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    inputElement.classList.remove('error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Show success alert
function showSuccessAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.innerHTML = `
        <span>✓</span>
        <span>${message}</span>
    `;
    
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Show error alert
function showErrorAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.innerHTML = `
        <span>✕</span>
        <span>${message}</span>
    `;
    
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Check authentication and redirect if needed
function checkAuth(requiredRole = null) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = '/login.html';
        return null;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
        window.location.href = '/login.html';
        return null;
    }
    
    return currentUser;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
}

// Get data from localStorage with default
function getFromStorage(key, defaultValue = []) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

// Save data to localStorage
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Get user by ID
function getUserById(userId) {
    const users = getFromStorage('users', []);
    return users.find(u => u.id === userId);
}

// Get property by ID
function getPropertyById(propertyId) {
    const properties = getFromStorage('properties', []);
    return properties.find(p => p.id === propertyId);
}

// Get appointment by ID
function getAppointmentById(appointmentId) {
    const appointments = getFromStorage('appointments', []);
    return appointments.find(a => a.id === appointmentId);
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusClasses = {
        'confirmed': 'badge-confirmed',
        'pending': 'badge-pending',
        'cancelled': 'badge-cancelled',
        'completed': 'badge-success',
        'active': 'badge-success',
        'approved': 'badge-success'
    };
    
    const className = statusClasses[status] || 'badge-pending';
    return `<span class="badge ${className}">${status}</span>`;
}

// Get role badge HTML
function getRoleBadge(role) {
    const roleClasses = {
        'admin': 'badge-admin',
        'agent': 'badge-agent',
        'customer': 'badge-customer'
    };
    
    const className = roleClasses[role] || 'badge-customer';
    return `<span class="badge ${className}">${role}</span>`;
}

// Generate initials from name
function getInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Render star rating
function renderStars(rating, interactive = false) {
    let html = '<div class="rating">';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= rating ? 'filled' : '';
        if (interactive) {
            html += `<span class="star ${filled}" data-rating="${i}">★</span>`;
        } else {
            html += `<span class="star ${filled}">★</span>`;
        }
    }
    html += '</div>';
    return html;
}

// Setup interactive star rating
function setupStarRating(containerElement, callback) {
    const stars = containerElement.querySelectorAll('.star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStars(selectedRating);
            if (callback) callback(selectedRating);
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            updateStars(rating);
        });
    });
    
    containerElement.addEventListener('mouseleave', () => {
        updateStars(selectedRating);
    });
    
    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            if (starRating <= rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }
}

// Create calendar for month
function createCalendar(year, month, onDateSelect) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    let html = `
        <div class="calendar">
            <div class="calendar-header">
                <button class="calendar-nav-btn" id="prevMonth">‹</button>
                <div class="calendar-title">${monthNames[month]} ${year}</div>
                <button class="calendar-nav-btn" id="nextMonth">›</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
    `;
    
    // Empty cells before first day
    for (let i = 0; i < startDayOfWeek; i++) {
        html += '<div class="calendar-day disabled"></div>';
    }
    
    // Days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isPast) classes += ' disabled';
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        html += `<div class="${classes}" data-date="${dateStr}">${day}</div>`;
    }
    
    html += '</div></div>';
    
    return html;
}

// Setup calendar interaction
function setupCalendar(containerElement, onDateSelect) {
    let currentYear = 2025;
    let currentMonth = 10; // November (0-indexed)
    let selectedDate = null;
    
    function render() {
        containerElement.innerHTML = createCalendar(currentYear, currentMonth, onDateSelect);
        
        // Setup navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            render();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            render();
        });
        
        // Setup day selection
        const days = containerElement.querySelectorAll('.calendar-day:not(.disabled)');
        days.forEach(day => {
            day.addEventListener('click', () => {
                // Remove previous selection
                containerElement.querySelectorAll('.calendar-day').forEach(d => {
                    d.classList.remove('selected');
                });
                
                // Add new selection
                day.classList.add('selected');
                selectedDate = day.dataset.date;
                
                if (onDateSelect) {
                    onDateSelect(selectedDate);
                }
            });
        });
    }
    
    render();
    
    return {
        getSelectedDate: () => selectedDate
    };
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Filter array by search term
function filterBySearch(items, searchTerm, fields) {
    if (!searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
        return fields.some(field => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], item);
            return value && value.toString().toLowerCase().includes(term);
        });
    });
}

// Sort array by field
function sortBy(items, field, direction = 'asc') {
    return [...items].sort((a, b) => {
        const aVal = field.split('.').reduce((obj, key) => obj?.[key], a);
        const bVal = field.split('.').reduce((obj, key) => obj?.[key], b);
        
        if (direction === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
}

// Create notification
function createNotification(userId, type, title, message, metadata = {}) {
    const notifications = getFromStorage('notifications', []);
    const notification = {
        id: notifications.length + 1,
        userId,
        type,
        title,
        message,
        metadata,
        read: false,
        createdAt: new Date().toISOString()
    };
    
    notifications.push(notification);
    saveToStorage('notifications', notifications);
    
    return notification;
}

// Get unread notification count
function getUnreadNotificationCount(userId) {
    const notifications = getFromStorage('notifications', []);
    return notifications.filter(n => n.userId === userId && !n.read).length;
}

// Mark notification as read
function markNotificationAsRead(notificationId) {
    const notifications = getFromStorage('notifications', []);
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
        notification.read = true;
        saveToStorage('notifications', notifications);
    }
}

// Show modal
function showModal(title, content, onConfirm = null) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" id="modalClose">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" id="modalCancel">Cancel</button>
                ${onConfirm ? '<button class="btn btn-primary" id="modalConfirm">Confirm</button>' : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Setup event listeners
    const close = () => {
        overlay.remove();
    };
    
    document.getElementById('modalClose').addEventListener('click', close);
    document.getElementById('modalCancel').addEventListener('click', close);
    
    if (onConfirm) {
        document.getElementById('modalConfirm').addEventListener('click', () => {
            onConfirm();
            close();
        });
    }
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            close();
        }
    });
}

// Handle file upload preview
function handleFileUpload(inputElement, previewElement, maxFiles = 1) {
    const files = Array.from(inputElement.files);
    
    if (files.length > maxFiles) {
        showErrorAlert(`Maximum ${maxFiles} file(s) allowed`);
        inputElement.value = '';
        return;
    }
    
    files.forEach((file, index) => {
        if (!file.type.startsWith('image/')) {
            showErrorAlert('Only image files are allowed');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('div');
            img.className = 'gallery-item';
            img.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button class="gallery-remove" data-index="${index}">×</button>
            `;
            previewElement.appendChild(img);
            
            // Setup remove button
            img.querySelector('.gallery-remove').addEventListener('click', () => {
                img.remove();
            });
        };
        reader.readAsDataURL(file);
    });
}

// Export functions (for module systems if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatDate,
        formatDateShort,
        timeAgo,
        generateBookingId,
        validateEmail,
        validatePassword,
        validatePhone,
        showError,
        hideError,
        showSuccessAlert,
        showErrorAlert,
        checkAuth,
        logout,
        getFromStorage,
        saveToStorage,
        getUserById,
        getPropertyById,
        getAppointmentById,
        getStatusBadge,
        getRoleBadge,
        getInitials,
        renderStars,
        setupStarRating,
        createCalendar,
        setupCalendar,
        debounce,
        filterBySearch,
        sortBy,
        createNotification,
        getUnreadNotificationCount,
        markNotificationAsRead,
        showModal,
        handleFileUpload
    };
}
