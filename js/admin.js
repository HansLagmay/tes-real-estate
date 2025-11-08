// TES Real Estate - Admin-specific Features

// Get all users with filters
function getAllUsers(filters = {}) {
    let users = getFromStorage('users', []);
    
    if (filters.role && filters.role !== 'all') {
        users = users.filter(u => u.role === filters.role);
    }
    
    if (filters.search) {
        const term = filters.search.toLowerCase();
        users = users.filter(u => 
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        );
    }
    
    return users;
}

// Get all properties with filters
function getAllProperties(filters = {}) {
    let properties = getFromStorage('properties', []);
    
    if (filters.status && filters.status !== 'all') {
        properties = properties.filter(p => p.status === filters.status);
    }
    
    return properties;
}

// Get all appointments with filters
function getAllAppointments(filters = {}) {
    let appointments = getFromStorage('appointments', []);
    
    if (filters.status && filters.status !== 'all') {
        appointments = appointments.filter(a => a.status === filters.status);
    }
    
    return appointments;
}

// Get all reviews with filters
function getAllReviews(filters = {}) {
    let reviews = getFromStorage('reviews', []);
    
    if (filters.status && filters.status !== 'all') {
        reviews = reviews.filter(r => r.status === filters.status);
    }
    
    return reviews;
}

// Get pending agent applications
function getPendingAgents() {
    const users = getFromStorage('users', []);
    return users.filter(u => u.role === 'agent' && u.status === 'pending');
}

// Approve agent
function approveAgent(agentId) {
    const users = getFromStorage('users', []);
    const agent = users.find(u => u.id === agentId);
    
    if (!agent) {
        return { success: false, message: 'Agent not found' };
    }
    
    agent.status = 'approved';
    saveToStorage('users', users);
    
    // Notify agent
    createNotification(
        agentId,
        'agent_approved',
        'Account Approved',
        'Your agent account has been approved! You can now add properties.',
        {}
    );
    
    return { success: true };
}

// Reject agent
function rejectAgent(agentId) {
    const users = getFromStorage('users', []);
    const agent = users.find(u => u.id === agentId);
    
    if (!agent) {
        return { success: false, message: 'Agent not found' };
    }
    
    agent.status = 'rejected';
    saveToStorage('users', users);
    
    // Notify agent
    createNotification(
        agentId,
        'agent_rejected',
        'Application Update',
        'Your agent application has been reviewed. Please contact support for more information.',
        {}
    );
    
    return { success: true };
}

// Approve property
function approveProperty(propertyId) {
    const properties = getFromStorage('properties', []);
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
        return { success: false, message: 'Property not found' };
    }
    
    property.status = 'active';
    saveToStorage('properties', properties);
    
    // Notify agent
    createNotification(
        property.agentId,
        'property_approved',
        'Property Approved',
        `${property.name} has been approved and is now visible to customers`,
        { propertyId }
    );
    
    return { success: true };
}

// Reject property
function rejectProperty(propertyId) {
    const properties = getFromStorage('properties', []);
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
        return { success: false, message: 'Property not found' };
    }
    
    property.status = 'rejected';
    saveToStorage('properties', properties);
    
    // Notify agent
    createNotification(
        property.agentId,
        'property_rejected',
        'Property Review',
        `${property.name} needs revision. Please contact support for details.`,
        { propertyId }
    );
    
    return { success: true };
}

// Approve review
function approveReview(reviewId) {
    const reviews = getFromStorage('reviews', []);
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
        return { success: false, message: 'Review not found' };
    }
    
    review.status = 'published';
    saveToStorage('reviews', reviews);
    
    // Update agent rating
    const agent = getUserById(review.agentId);
    if (agent) {
        const agentReviews = getAllReviews().filter(r => r.agentId === review.agentId && r.status === 'published');
        const avgRating = agentReviews.reduce((sum, r) => sum + r.agentRating, 0) / agentReviews.length;
        
        const users = getFromStorage('users', []);
        const agentIndex = users.findIndex(u => u.id === review.agentId);
        users[agentIndex].rating = avgRating;
        saveToStorage('users', users);
    }
    
    return { success: true };
}

// Delete review
function deleteReview(reviewId) {
    const reviews = getFromStorage('reviews', []);
    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    saveToStorage('reviews', updatedReviews);
    
    return { success: true };
}

// Delete user
function deleteUser(userId) {
    const users = getFromStorage('users', []);
    
    // Cannot delete admin
    const user = users.find(u => u.id === userId);
    if (user && user.role === 'admin') {
        return { success: false, message: 'Cannot delete admin user' };
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    saveToStorage('users', updatedUsers);
    
    return { success: true };
}

// Get admin statistics
function getAdminStats() {
    const users = getFromStorage('users', []);
    const properties = getFromStorage('properties', []);
    const appointments = getFromStorage('appointments', []);
    const reviews = getFromStorage('reviews', []);
    
    return {
        totalUsers: users.length,
        totalCustomers: users.filter(u => u.role === 'customer').length,
        totalAgents: users.filter(u => u.role === 'agent' && u.status === 'approved').length,
        pendingAgents: users.filter(u => u.role === 'agent' && u.status === 'pending').length,
        
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.status === 'active').length,
        pendingProperties: properties.filter(p => p.status === 'pending').length,
        
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        
        totalReviews: reviews.length,
        publishedReviews: reviews.filter(r => r.status === 'published').length,
        pendingReviews: reviews.filter(r => r.status === 'pending').length,
        averageRating: reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
            : 0
    };
}

// Get recent activity
function getRecentActivity(limit = 10) {
    const activities = [];
    
    // Get recent appointments
    const appointments = getFromStorage('appointments', []).slice(-5);
    appointments.forEach(a => {
        const customer = getUserById(a.customerId);
        const property = getPropertyById(a.propertyId);
        activities.push({
            type: 'appointment',
            title: 'New Appointment',
            description: `${customer?.name} booked ${property?.name}`,
            timestamp: a.createdAt
        });
    });
    
    // Get recent reviews
    const reviews = getFromStorage('reviews', []).slice(-3);
    reviews.forEach(r => {
        const customer = getUserById(r.customerId);
        const property = getPropertyById(r.propertyId);
        activities.push({
            type: 'review',
            title: 'New Review',
            description: `${customer?.name} reviewed ${property?.name}`,
            timestamp: r.createdAt
        });
    });
    
    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return activities.slice(0, limit);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllUsers,
        getAllProperties,
        getAllAppointments,
        getAllReviews,
        getPendingAgents,
        approveAgent,
        rejectAgent,
        approveProperty,
        rejectProperty,
        approveReview,
        deleteReview,
        deleteUser,
        getAdminStats,
        getRecentActivity
    };
}
