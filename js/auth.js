// TES Real Estate - Authentication Logic

// Login function
function login(email, password, role) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching credentials and role
    const user = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === role
    );
    
    if (!user) {
        return { success: false, message: 'Invalid credentials or role' };
    }
    
    // Check if agent is approved
    if (user.role === 'agent' && user.status !== 'approved') {
        return { success: false, message: 'Your agent account is pending approval' };
    }
    
    // Save current user session
    const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        loginTime: new Date().toISOString()
    };
    
    // Add role-specific data
    if (user.role === 'agent') {
        session.license = user.license;
        session.agency = user.agency;
        session.rating = user.rating;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(session));
    
    return { success: true, user: session };
}

// Register function
function register(userData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Validate password
    if (!validatePassword(userData.password)) {
        return { 
            success: false, 
            message: 'Password must be at least 8 characters with 1 uppercase and 1 number' 
        };
    }
    
    // Validate email
    if (!validateEmail(userData.email)) {
        return { success: false, message: 'Invalid email format' };
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        phone: userData.phone,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Add role-specific fields
    if (userData.role === 'agent') {
        newUser.license = userData.license;
        newUser.agency = userData.agency;
        newUser.status = 'pending'; // Agents need approval
        newUser.rating = 0;
        newUser.totalAppointments = 0;
        newUser.totalProperties = 0;
    } else if (userData.role === 'customer') {
        newUser.address = userData.address || '';
    }
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Create notification for admin if agent registration
    if (userData.role === 'agent') {
        createNotification(
            1, // Admin user ID
            'agent_pending',
            'New Agent Application',
            `${userData.name} has applied to become an agent`,
            { userId: newUser.id }
        );
    }
    
    return { success: true, user: newUser };
}

// Forgot password - send reset link (simulated)
function forgotPassword(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return { success: false, message: 'Email not found' };
    }
    
    // In a real app, this would send an email
    // For demo purposes, we'll just return success
    return { 
        success: true, 
        message: 'Password reset instructions sent to your email' 
    };
}

// Reset password (simulated)
function resetPassword(email, newPassword) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    
    if (!validatePassword(newPassword)) {
        return { 
            success: false, 
            message: 'Password must be at least 8 characters with 1 uppercase and 1 number' 
        };
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Password reset successfully' };
}

// Get current user session
function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

// Check if user is authenticated
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Check if user has specific role
function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

// Logout function
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
}

// Redirect based on role
function redirectToDashboard(role) {
    const dashboards = {
        'admin': '/admin/dashboard.html',
        'agent': '/agent/dashboard.html',
        'customer': '/customer/dashboard.html'
    };
    
    window.location.href = dashboards[role] || '/login.html';
}

// Check authentication and redirect if not logged in
function requireAuth(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = '/login.html';
        return null;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        // Redirect to their own dashboard
        redirectToDashboard(user.role);
        return null;
    }
    
    return user;
}

// Update user profile
function updateProfile(userId, updates) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    
    // Validate email if changed
    if (updates.email && updates.email !== users[userIndex].email) {
        if (!validateEmail(updates.email)) {
            return { success: false, message: 'Invalid email format' };
        }
        
        // Check if new email already exists
        const emailExists = users.find(u => u.email === updates.email && u.id !== userId);
        if (emailExists) {
            return { success: false, message: 'Email already in use' };
        }
    }
    
    // Validate phone if provided
    if (updates.phone && !validatePhone(updates.phone)) {
        return { success: false, message: 'Invalid phone number' };
    }
    
    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current session if it's the logged-in user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        const updatedSession = { ...currentUser, ...updates };
        localStorage.setItem('currentUser', JSON.stringify(updatedSession));
    }
    
    return { success: true, user: users[userIndex] };
}

// Change password
function changePassword(userId, currentPassword, newPassword) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    
    if (user.password !== currentPassword) {
        return { success: false, message: 'Current password is incorrect' };
    }
    
    if (!validatePassword(newPassword)) {
        return { 
            success: false, 
            message: 'Password must be at least 8 characters with 1 uppercase and 1 number' 
        };
    }
    
    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Password changed successfully' };
}

// Export functions for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        login,
        register,
        forgotPassword,
        resetPassword,
        getCurrentUser,
        isAuthenticated,
        hasRole,
        logoutUser,
        redirectToDashboard,
        requireAuth,
        updateProfile,
        changePassword
    };
}
