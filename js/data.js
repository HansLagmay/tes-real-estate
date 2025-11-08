// TES Real Estate - Sample Data Initialization

function initializeData() {
    // Check if data already exists
    if (localStorage.getItem('dataInitialized') === 'true') {
        return;
    }
    
    // Pre-created users
    const users = [
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@tesrealestate.com',
            password: 'Admin123!',
            role: 'admin',
            phone: '09171234567',
            createdAt: '2025-01-15'
        },
        {
            id: 2,
            name: 'Juan Dela Cruz',
            email: 'juan@tesrealestate.com',
            password: 'Agent123!',
            role: 'agent',
            license: 'REA-2025-1234',
            agency: 'TES Real Estate',
            status: 'approved',
            phone: '09181234567',
            rating: 4.8,
            totalAppointments: 45,
            totalProperties: 8,
            createdAt: '2025-02-01'
        },
        {
            id: 3,
            name: 'Hans Lagmay',
            email: 'hans@tesrealestate.com',
            password: 'Customer123!',
            role: 'customer',
            phone: '09191234567',
            address: 'Manila, Philippines',
            createdAt: '2025-03-10'
        },
        {
            id: 4,
            name: 'Maria Santos',
            email: 'maria@tesrealestate.com',
            password: 'Agent123!',
            role: 'agent',
            license: 'REA-2025-9012',
            agency: 'Prime Properties Inc',
            status: 'pending',
            phone: '09201234567',
            rating: 0,
            totalAppointments: 0,
            totalProperties: 0,
            createdAt: '2025-10-15'
        },
        {
            id: 5,
            name: 'Pedro Reyes',
            email: 'pedro@tesrealestate.com',
            password: 'Customer123!',
            role: 'customer',
            phone: '09211234567',
            address: 'Quezon City, Philippines',
            createdAt: '2025-05-20'
        }
    ];
    
    // Sample properties
    const properties = [
        {
            id: 1,
            name: 'Palm Residence',
            type: 'Condominium',
            price: 8500000,
            location: 'Makati City, Metro Manila',
            bedrooms: 2,
            bathrooms: 2,
            floorArea: 85,
            description: 'Modern condominium unit with stunning city views. Fully furnished with premium amenities including swimming pool, gym, and 24/7 security.',
            agentId: 2,
            status: 'active',
            images: ['building-placeholder.jpg'],
            createdAt: '2025-06-01'
        },
        {
            id: 2,
            name: 'Garden Lot #5',
            type: 'Lot',
            price: 2500000,
            location: 'Laguna, Calabarzon',
            lotArea: 350,
            description: 'Prime residential lot in a peaceful subdivision. Perfect for building your dream home. Near schools, hospitals, and commercial centers.',
            agentId: 2,
            status: 'active',
            images: ['lot-placeholder.jpg'],
            createdAt: '2025-06-15'
        },
        {
            id: 3,
            name: 'Sunrise Villa',
            type: 'House',
            price: 6500000,
            location: 'Quezon City, Metro Manila',
            bedrooms: 3,
            bathrooms: 2,
            floorArea: 120,
            description: 'Beautiful single-detached house with spacious living areas. Well-maintained garden and secure neighborhood.',
            agentId: 4,
            status: 'pending',
            images: ['house-placeholder.jpg'],
            createdAt: '2025-10-20'
        },
        {
            id: 4,
            name: 'Bayview Condo',
            type: 'Condominium',
            price: 7200000,
            location: 'Pasay City, Metro Manila',
            bedrooms: 2,
            bathrooms: 2,
            floorArea: 75,
            description: 'Luxurious condo unit with breathtaking bay views. Walking distance to malls and entertainment centers.',
            agentId: 2,
            status: 'active',
            images: ['building-placeholder.jpg'],
            createdAt: '2025-07-01'
        },
        {
            id: 5,
            name: 'Mountain View Townhouse',
            type: 'Townhouse',
            price: 5800000,
            location: 'Antipolo, Rizal',
            bedrooms: 3,
            bathrooms: 3,
            floorArea: 110,
            description: 'Cozy townhouse with mountain views. Perfect for families looking for a peaceful environment.',
            agentId: 2,
            status: 'active',
            images: ['house-placeholder.jpg'],
            createdAt: '2025-07-15'
        },
        {
            id: 6,
            name: 'Executive Suite',
            type: 'Condominium',
            price: 12000000,
            location: 'BGC, Taguig City',
            bedrooms: 3,
            bathrooms: 3,
            floorArea: 150,
            description: 'Premium executive suite in the heart of BGC. Top-of-the-line finishes and world-class amenities.',
            agentId: 2,
            status: 'active',
            images: ['building-placeholder.jpg'],
            createdAt: '2025-08-01'
        },
        {
            id: 7,
            name: 'Countryside Lot',
            type: 'Lot',
            price: 3200000,
            location: 'Cavite, Calabarzon',
            lotArea: 500,
            description: 'Spacious lot in a developing area. Great investment opportunity with high appreciation potential.',
            agentId: 2,
            status: 'active',
            images: ['lot-placeholder.jpg'],
            createdAt: '2025-08-15'
        },
        {
            id: 8,
            name: 'Lakeside House',
            type: 'House',
            price: 9500000,
            location: 'Talisay, Batangas',
            bedrooms: 4,
            bathrooms: 3,
            floorArea: 180,
            description: 'Stunning lakeside property with private dock. Perfect weekend retreat or permanent residence.',
            agentId: 2,
            status: 'active',
            images: ['house-placeholder.jpg'],
            createdAt: '2025-09-01'
        },
        {
            id: 9,
            name: 'Urban Loft',
            type: 'Condominium',
            price: 4500000,
            location: 'Mandaluyong City, Metro Manila',
            bedrooms: 1,
            bathrooms: 1,
            floorArea: 45,
            description: 'Modern studio loft perfect for young professionals. Near business districts and transport hubs.',
            agentId: 2,
            status: 'active',
            images: ['building-placeholder.jpg'],
            createdAt: '2025-09-15'
        },
        {
            id: 10,
            name: 'Family Townhouse',
            type: 'Townhouse',
            price: 6800000,
            location: 'Parañaque City, Metro Manila',
            bedrooms: 3,
            bathrooms: 2,
            floorArea: 130,
            description: 'Spacious townhouse in a family-friendly community. Near schools, parks, and shopping centers.',
            agentId: 2,
            status: 'active',
            images: ['house-placeholder.jpg'],
            createdAt: '2025-10-01'
        }
    ];
    
    // Sample appointments
    const appointments = [
        {
            id: 1,
            customerId: 3,
            agentId: 2,
            propertyId: 1,
            date: '2025-11-17',
            time: '10:00 AM - 11:00 AM',
            status: 'confirmed',
            bookingId: 'TES-2025-11-001',
            notes: '',
            createdAt: '2025-11-05'
        },
        {
            id: 2,
            customerId: 3,
            agentId: 2,
            propertyId: 2,
            date: '2025-11-21',
            time: '2:00 PM - 3:00 PM',
            status: 'pending',
            bookingId: 'TES-2025-11-002',
            notes: 'Please bring property documents',
            createdAt: '2025-11-06'
        },
        {
            id: 3,
            customerId: 5,
            agentId: 2,
            propertyId: 4,
            date: '2025-10-15',
            time: '9:00 AM - 10:00 AM',
            status: 'completed',
            bookingId: 'TES-2025-10-001',
            notes: '',
            createdAt: '2025-10-01'
        },
        {
            id: 4,
            customerId: 5,
            agentId: 2,
            propertyId: 5,
            date: '2025-10-20',
            time: '3:00 PM - 4:00 PM',
            status: 'completed',
            bookingId: 'TES-2025-10-002',
            notes: '',
            createdAt: '2025-10-05'
        },
        {
            id: 5,
            customerId: 3,
            agentId: 2,
            propertyId: 6,
            date: '2025-11-10',
            time: '11:00 AM - 12:00 PM',
            status: 'cancelled',
            bookingId: 'TES-2025-11-003',
            notes: 'Customer request',
            createdAt: '2025-10-28'
        }
    ];
    
    // Sample reviews
    const reviews = [
        {
            id: 1,
            customerId: 5,
            propertyId: 1,
            appointmentId: 3,
            agentId: 2,
            rating: 5,
            propertyRating: 5,
            agentRating: 5,
            comment: 'Excellent property with great location. The agent was very professional and helpful throughout the entire process. Highly recommended!',
            status: 'published',
            createdAt: '2025-10-20'
        },
        {
            id: 2,
            customerId: 5,
            propertyId: 5,
            appointmentId: 4,
            agentId: 2,
            rating: 4,
            propertyRating: 4,
            agentRating: 5,
            comment: 'Beautiful townhouse with amazing views. The location is perfect for families. Agent was knowledgeable and patient.',
            status: 'published',
            createdAt: '2025-10-25'
        },
        {
            id: 3,
            customerId: 3,
            propertyId: 2,
            appointmentId: 2,
            agentId: 2,
            rating: 5,
            propertyRating: 5,
            agentRating: 5,
            comment: 'Great lot with excellent potential. Looking forward to building my dream house here!',
            status: 'pending',
            createdAt: '2025-11-07'
        }
    ];
    
    // Sample notifications
    const notifications = [
        {
            id: 1,
            userId: 3,
            type: 'booking_confirmed',
            title: 'Booking Confirmed',
            message: 'Your appointment for Palm Residence has been confirmed for Nov 17, 2025 at 10:00 AM',
            metadata: { appointmentId: 1 },
            read: false,
            createdAt: '2025-11-05T10:30:00'
        },
        {
            id: 2,
            userId: 3,
            type: 'reminder',
            title: 'Appointment Reminder',
            message: 'Your appointment is tomorrow at 10:00 AM for Palm Residence',
            metadata: { appointmentId: 1 },
            read: false,
            createdAt: '2025-11-16T09:00:00'
        },
        {
            id: 3,
            userId: 3,
            type: 'new_property',
            title: 'New Property Available',
            message: 'Check out the new Executive Suite in BGC that matches your preferences',
            metadata: { propertyId: 6 },
            read: true,
            createdAt: '2025-08-01T14:00:00'
        },
        {
            id: 4,
            userId: 2,
            type: 'review_received',
            title: 'New Review Received',
            message: 'Pedro Reyes left a 5-star review for Palm Residence',
            metadata: { reviewId: 1 },
            read: false,
            createdAt: '2025-10-20T16:00:00'
        },
        {
            id: 5,
            userId: 2,
            type: 'appointment_request',
            title: 'New Appointment Request',
            message: 'Hans Lagmay requested an appointment for Garden Lot #5',
            metadata: { appointmentId: 2 },
            read: false,
            createdAt: '2025-11-06T11:00:00'
        },
        {
            id: 6,
            userId: 1,
            type: 'agent_pending',
            title: 'New Agent Application',
            message: 'Maria Santos has applied to become an agent',
            metadata: { userId: 4 },
            read: false,
            createdAt: '2025-10-15T09:00:00'
        },
        {
            id: 7,
            userId: 1,
            type: 'property_pending',
            title: 'Property Pending Approval',
            message: 'Sunrise Villa is waiting for approval',
            metadata: { propertyId: 3 },
            read: false,
            createdAt: '2025-10-20T10:00:00'
        }
    ];
    
    // Save all data to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('properties', JSON.stringify(properties));
    localStorage.setItem('appointments', JSON.stringify(appointments));
    localStorage.setItem('reviews', JSON.stringify(reviews));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('dataInitialized', 'true');
    
    console.log('Sample data initialized successfully');
}

// Initialize data when script loads
if (typeof window !== 'undefined') {
    initializeData();
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeData };
}
