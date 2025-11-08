// TES Real Estate - Agent-specific Features

// Get agent's appointments
function getAgentAppointments(agentId, filters = {}) {
    let appointments = getFromStorage('appointments', []).filter(a => a.agentId === agentId);
    
    // Apply filters
    if (filters.status && filters.status !== 'all') {
        if (filters.status === 'today') {
            const today = new Date().toISOString().split('T')[0];
            appointments = appointments.filter(a => a.date === today);
        } else if (filters.status === 'upcoming') {
            appointments = appointments.filter(a => new Date(a.date) >= new Date());
        } else if (filters.status === 'past') {
            appointments = appointments.filter(a => new Date(a.date) < new Date());
        } else {
            appointments = appointments.filter(a => a.status === filters.status);
        }
    }
    
    return appointments;
}

// Get agent's properties
function getAgentProperties(agentId, filters = {}) {
    let properties = getFromStorage('properties', []).filter(p => p.agentId === agentId);
    
    if (filters.status && filters.status !== 'all') {
        properties = properties.filter(p => p.status === filters.status);
    }
    
    return properties;
}

// Add new property
function addProperty(propertyData) {
    const properties = getFromStorage('properties', []);
    
    const newProperty = {
        id: properties.length + 1,
        name: propertyData.name,
        type: propertyData.type,
        price: parseInt(propertyData.price),
        location: propertyData.location,
        bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms) : null,
        bathrooms: propertyData.bathrooms ? parseInt(propertyData.bathrooms) : null,
        floorArea: propertyData.floorArea ? parseInt(propertyData.floorArea) : null,
        lotArea: propertyData.lotArea ? parseInt(propertyData.lotArea) : null,
        description: propertyData.description,
        agentId: propertyData.agentId,
        status: 'pending', // Needs admin approval
        images: propertyData.images || [],
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    properties.push(newProperty);
    saveToStorage('properties', properties);
    
    // Notify admin
    createNotification(
        1, // Admin user ID
        'property_pending',
        'Property Pending Approval',
        `${newProperty.name} is waiting for approval`,
        { propertyId: newProperty.id }
    );
    
    return { success: true, property: newProperty };
}

// Update property
function updateProperty(propertyId, updates) {
    const properties = getFromStorage('properties', []);
    const propertyIndex = properties.findIndex(p => p.id === propertyId);
    
    if (propertyIndex === -1) {
        return { success: false, message: 'Property not found' };
    }
    
    // Update property (status resets to pending if edited)
    properties[propertyIndex] = {
        ...properties[propertyIndex],
        ...updates,
        status: 'pending'
    };
    
    saveToStorage('properties', properties);
    
    // Notify admin
    createNotification(
        1,
        'property_updated',
        'Property Updated',
        `${properties[propertyIndex].name} has been updated and needs re-approval`,
        { propertyId }
    );
    
    return { success: true, property: properties[propertyIndex] };
}

// Delete property
function deleteProperty(propertyId, agentId) {
    const properties = getFromStorage('properties', []);
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
        return { success: false, message: 'Property not found' };
    }
    
    if (property.agentId !== agentId) {
        return { success: false, message: 'Unauthorized' };
    }
    
    const updatedProperties = properties.filter(p => p.id !== propertyId);
    saveToStorage('properties', updatedProperties);
    
    return { success: true };
}

// Confirm appointment
function confirmAppointment(appointmentId, agentId) {
    const appointments = getFromStorage('appointments', []);
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
        return { success: false, message: 'Appointment not found' };
    }
    
    if (appointment.agentId !== agentId) {
        return { success: false, message: 'Unauthorized' };
    }
    
    appointment.status = 'confirmed';
    saveToStorage('appointments', appointments);
    
    // Notify customer
    createNotification(
        appointment.customerId,
        'booking_confirmed',
        'Booking Confirmed',
        `Your appointment has been confirmed for ${formatDate(appointment.date)}`,
        { appointmentId }
    );
    
    return { success: true };
}

// Complete appointment
function completeAppointment(appointmentId, agentId) {
    const appointments = getFromStorage('appointments', []);
    const appointment = appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
        return { success: false, message: 'Appointment not found' };
    }
    
    if (appointment.agentId !== agentId) {
        return { success: false, message: 'Unauthorized' };
    }
    
    appointment.status = 'completed';
    saveToStorage('appointments', appointments);
    
    return { success: true };
}

// Get agent statistics
function getAgentStats(agentId) {
    const appointments = getAgentAppointments(agentId);
    const properties = getAgentProperties(agentId);
    const today = new Date().toISOString().split('T')[0];
    
    return {
        totalAppointments: appointments.length,
        todayAppointments: appointments.filter(a => a.date === today).length,
        confirmedAppointments: appointments.filter(a => a.status === 'confirmed').length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.status === 'active').length,
        pendingProperties: properties.filter(p => p.status === 'pending').length
    };
}

// Get agent performance data (for charts)
function getAgentPerformance(agentId, period = 'week') {
    const appointments = getAgentAppointments(agentId);
    
    // Generate data for the last 7 days
    const data = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = appointments.filter(a => a.date === dateStr).length;
        
        data.push({
            label: days[date.getDay()],
            value: count
        });
    }
    
    return data;
}

// Get top performing properties
function getTopProperties(agentId, limit = 5) {
    const properties = getAgentProperties(agentId);
    const appointments = getAgentAppointments(agentId);
    
    // Count appointments per property
    const propertyCounts = {};
    appointments.forEach(a => {
        propertyCounts[a.propertyId] = (propertyCounts[a.propertyId] || 0) + 1;
    });
    
    // Sort properties by appointment count
    const sorted = properties
        .map(p => ({
            ...p,
            appointmentCount: propertyCounts[p.id] || 0
        }))
        .sort((a, b) => b.appointmentCount - a.appointmentCount)
        .slice(0, limit);
    
    return sorted;
}

// Get agent reviews
function getAgentReviews(agentId) {
    const reviews = getFromStorage('reviews', []);
    return reviews.filter(r => r.agentId === agentId && r.status === 'published');
}

// Calculate agent rating
function calculateAgentRating(agentId) {
    const reviews = getAgentReviews(agentId);
    
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, r) => sum + r.agentRating, 0);
    return (totalRating / reviews.length).toFixed(1);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAgentAppointments,
        getAgentProperties,
        addProperty,
        updateProperty,
        deleteProperty,
        confirmAppointment,
        completeAppointment,
        getAgentStats,
        getAgentPerformance,
        getTopProperties,
        getAgentReviews,
        calculateAgentRating
    };
}
