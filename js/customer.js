// TES Real Estate - Customer-specific Features

// Get customer's bookings
function getCustomerBookings(customerId) {
    const appointments = getFromStorage('appointments', []);
    return appointments.filter(a => a.customerId === customerId);
}

// Get customer's reviews
function getCustomerReviews(customerId) {
    const reviews = getFromStorage('reviews', []);
    return reviews.filter(r => r.customerId === customerId);
}

// Book an appointment
function bookAppointment(appointmentData) {
    const appointments = getFromStorage('appointments', []);
    
    const newAppointment = {
        id: appointments.length + 1,
        customerId: appointmentData.customerId,
        agentId: appointmentData.agentId,
        propertyId: appointmentData.propertyId,
        date: appointmentData.date,
        time: appointmentData.time,
        status: 'pending',
        bookingId: generateBookingId(),
        notes: appointmentData.notes || '',
        createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    saveToStorage('appointments', appointments);
    
    // Create notification for agent
    createNotification(
        appointmentData.agentId,
        'appointment_request',
        'New Appointment Request',
        `You have a new appointment request`,
        { appointmentId: newAppointment.id }
    );
    
    // Create notification for customer
    createNotification(
        appointmentData.customerId,
        'booking_confirmed',
        'Booking Received',
        `Your appointment request has been submitted and is pending confirmation`,
        { appointmentId: newAppointment.id }
    );
    
    return { success: true, appointment: newAppointment };
}

// Cancel appointment
function cancelAppointment(appointmentId, userId) {
    const appointments = getFromStorage('appointments', []);
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
        return { success: false, message: 'Appointment not found' };
    }
    
    if (appointment.customerId !== userId) {
        return { success: false, message: 'Unauthorized' };
    }
    
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
        return { success: false, message: 'Cannot cancel this appointment' };
    }
    
    appointment.status = 'cancelled';
    saveToStorage('appointments', appointments);
    
    // Notify agent
    createNotification(
        appointment.agentId,
        'appointment_cancelled',
        'Appointment Cancelled',
        `An appointment has been cancelled`,
        { appointmentId }
    );
    
    return { success: true };
}

// Reschedule appointment
function rescheduleAppointment(appointmentId, userId, newDate, newTime) {
    const appointments = getFromStorage('appointments', []);
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
        return { success: false, message: 'Appointment not found' };
    }
    
    if (appointment.customerId !== userId) {
        return { success: false, message: 'Unauthorized' };
    }
    
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
        return { success: false, message: 'Cannot reschedule this appointment' };
    }
    
    appointment.date = newDate;
    appointment.time = newTime;
    appointment.status = 'pending'; // Reset to pending for agent confirmation
    saveToStorage('appointments', appointments);
    
    // Notify agent
    createNotification(
        appointment.agentId,
        'appointment_rescheduled',
        'Appointment Rescheduled',
        `An appointment has been rescheduled to ${formatDate(newDate)} at ${newTime}`,
        { appointmentId }
    );
    
    return { success: true };
}

// Submit review
function submitReview(reviewData) {
    const reviews = getFromStorage('reviews', []);
    
    const newReview = {
        id: reviews.length + 1,
        customerId: reviewData.customerId,
        propertyId: reviewData.propertyId,
        appointmentId: reviewData.appointmentId,
        agentId: reviewData.agentId,
        rating: reviewData.rating,
        propertyRating: reviewData.propertyRating,
        agentRating: reviewData.agentRating,
        comment: reviewData.comment,
        images: reviewData.images || [],
        status: 'pending', // Needs admin approval
        createdAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    saveToStorage('reviews', reviews);
    
    // Create notification for agent
    createNotification(
        reviewData.agentId,
        'review_received',
        'New Review Received',
        `You received a ${reviewData.rating}-star review`,
        { reviewId: newReview.id }
    );
    
    // Create notification for admin
    createNotification(
        1, // Admin user ID
        'review_pending',
        'Review Pending Approval',
        `A new review is waiting for moderation`,
        { reviewId: newReview.id }
    );
    
    return { success: true, review: newReview };
}

// Get available properties
function getAvailableProperties(filters = {}) {
    let properties = getFromStorage('properties', []);
    
    // Filter by status (only show active properties to customers)
    properties = properties.filter(p => p.status === 'active');
    
    // Apply filters
    if (filters.type && filters.type !== 'all') {
        properties = properties.filter(p => p.type === filters.type);
    }
    
    if (filters.minPrice) {
        properties = properties.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
        properties = properties.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        properties = properties.filter(p => 
            p.location.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filters.bedrooms) {
        properties = properties.filter(p => p.bedrooms >= filters.bedrooms);
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        properties = properties.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.location.toLowerCase().includes(searchTerm) ||
            p.type.toLowerCase().includes(searchTerm)
        );
    }
    
    return properties;
}

// Get customer statistics
function getCustomerStats(customerId) {
    const appointments = getCustomerBookings(customerId);
    const reviews = getCustomerReviews(customerId);
    
    return {
        totalBookings: appointments.length,
        upcomingBookings: appointments.filter(a => 
            a.status === 'confirmed' && new Date(a.date) >= new Date()
        ).length,
        completedBookings: appointments.filter(a => a.status === 'completed').length,
        totalReviews: reviews.length,
        publishedReviews: reviews.filter(r => r.status === 'published').length
    };
}

// Get customer's favorite properties (mock - would be stored separately in real app)
function getFavoriteProperties(customerId) {
    // In a real app, this would fetch from a favorites table
    // For demo, return empty array
    return [];
}

// Add property to favorites (mock)
function toggleFavorite(customerId, propertyId) {
    // In a real app, this would add/remove from favorites table
    return { success: true };
}

// Get property details with agent info
function getPropertyDetails(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return null;
    
    const agent = getUserById(property.agentId);
    
    return {
        ...property,
        agent: agent ? {
            id: agent.id,
            name: agent.name,
            phone: agent.phone,
            email: agent.email,
            rating: agent.rating || 0,
            license: agent.license,
            agency: agent.agency
        } : null
    };
}

// Get appointment details with all related info
function getAppointmentDetails(appointmentId) {
    const appointment = getAppointmentById(appointmentId);
    if (!appointment) return null;
    
    const property = getPropertyById(appointment.propertyId);
    const agent = getUserById(appointment.agentId);
    const customer = getUserById(appointment.customerId);
    
    return {
        ...appointment,
        property: property ? {
            id: property.id,
            name: property.name,
            type: property.type,
            price: property.price,
            location: property.location,
            images: property.images
        } : null,
        agent: agent ? {
            id: agent.id,
            name: agent.name,
            phone: agent.phone,
            email: agent.email,
            rating: agent.rating || 0
        } : null,
        customer: customer ? {
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email
        } : null
    };
}

// Check if customer can review appointment
function canReviewAppointment(appointmentId, customerId) {
    const appointment = getAppointmentById(appointmentId);
    if (!appointment) return false;
    
    // Can only review completed appointments
    if (appointment.status !== 'completed') return false;
    
    // Must be the customer who made the appointment
    if (appointment.customerId !== customerId) return false;
    
    // Check if already reviewed
    const reviews = getFromStorage('reviews', []);
    const existingReview = reviews.find(r => r.appointmentId === appointmentId);
    
    return !existingReview;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCustomerBookings,
        getCustomerReviews,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        submitReview,
        getAvailableProperties,
        getCustomerStats,
        getFavoriteProperties,
        toggleFavorite,
        getPropertyDetails,
        getAppointmentDetails,
        canReviewAppointment
    };
}
