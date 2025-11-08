# TES Real Estate Appointment System

A complete real estate appointment booking and property management system with role-based access for Customers, Agents, and Administrators.

## 🌟 Features

### For Customers
- Browse and search properties with filters
- Book appointments with 4-step booking flow
- Manage bookings (view, reschedule, cancel)
- Leave reviews and ratings for properties and agents
- View appointment history
- Receive notifications
- Profile management

### For Agents
- View and manage appointments
- Add and manage property listings
- Performance analytics and charts
- View customer profiles
- Receive appointment requests
- Track properties status (pending/approved)
- Profile with ratings and reviews

### For Administrators
- System overview dashboard
- User management
- Property approval system
- Agent approval system
- Review moderation
- Appointment monitoring
- Activity tracking

## 🚀 How to Run

1. Clone the repository
2. Open `index.html` in a web browser (recommended: use Live Server extension for VS Code)
3. Navigate through the application

**Or use a local server:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## 👤 Pre-created Accounts

### Admin Account
- **Email:** admin@tesrealestate.com
- **Password:** Admin123!
- **Access:** Full system control

### Agent Account (Approved)
- **Email:** juan@tesrealestate.com
- **Password:** Agent123!
- **License:** REA-2025-1234
- **Agency:** TES Real Estate

### Agent Account (Pending)
- **Email:** maria@tesrealestate.com
- **Password:** Agent123!
- **License:** REA-2025-9012
- **Agency:** Prime Properties Inc
- **Status:** Pending approval

### Customer Account
- **Email:** hans@tesrealestate.com
- **Password:** Customer123!

## 📁 File Structure

```
/
├── index.html                 # Landing page
├── login.html                 # Login with role selection
├── register.html              # Registration page
├── forgot-password.html       # Password recovery
├── customer/                  # Customer portal (10 pages)
│   ├── dashboard.html
│   ├── book-appointment.html
│   ├── my-bookings.html
│   ├── booking-details.html
│   ├── leave-review.html
│   ├── my-reviews.html
│   ├── profile.html
│   ├── edit-profile.html
│   ├── notifications.html
│   └── help.html
├── agent/                     # Agent portal (10 pages)
│   ├── dashboard.html
│   ├── appointments.html
│   ├── appointment-details.html
│   ├── properties.html
│   ├── add-property.html
│   ├── edit-property.html
│   ├── customer-profile.html
│   ├── performance.html
│   ├── profile.html
│   └── notifications.html
├── admin/                     # Admin portal (7 pages)
│   ├── dashboard.html
│   ├── users.html
│   ├── properties.html
│   ├── appointments.html
│   ├── reviews.html
│   ├── agent-approvals.html
│   └── menu.html
├── css/
│   └── style.css             # Comprehensive stylesheet
├── js/
│   ├── auth.js               # Authentication logic
│   ├── data.js               # Sample data initialization
│   ├── utils.js              # Helper functions
│   ├── customer.js           # Customer features
│   ├── agent.js              # Agent features
│   └── admin.js              # Admin features
└── README.md
```

## 🎨 Design Features

- **Color Scheme:**
  - Primary Gold: #D4AF37
  - Success Green: #10B981
  - Pending Orange: #F59E0B
  
- **UI Elements:**
  - Rounded pill-shaped buttons
  - Card-based layouts
  - Clean, modern design
  - Mobile-first responsive
  - Bottom navigation for mobile
  - Status badges with color coding

## 💾 Data Storage

All data is stored in browser's `localStorage`:
- Users (with roles and permissions)
- Properties (with approval status)
- Appointments (with booking history)
- Reviews (with moderation status)
- Notifications

## 🔒 Security Features

- Role-based access control
- Session management
- Password validation (min 8 chars, 1 uppercase, 1 number)
- Email format validation
- Philippine phone number validation
- Agent license verification
- Property approval workflow
- Review moderation

## 📱 Responsive Design

- Works on mobile (375px) to desktop (1920px)
- Touch-friendly interface
- Bottom navigation for mobile
- Optimized layouts for all screen sizes

## 🛠️ Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage:** LocalStorage API
- **No dependencies:** No frameworks, libraries, or external dependencies

## 🔄 Key Workflows

### Booking Appointment (Customer)
1. Browse properties or search
2. Select property
3. Choose date from calendar
4. Select time slot (Morning/Afternoon/Evening)
5. Confirm booking with optional notes
6. Receive booking confirmation

### Adding Property (Agent)
1. Fill property form (name, type, price, location, details)
2. Submit for approval
3. Wait for admin approval
4. Property becomes visible to customers once approved

### Agent Approval (Admin)
1. Review agent application
2. Verify license and agency information
3. Approve or reject
4. Approved agents can add properties

### Review Moderation (Admin)
1. Customer submits review after completed appointment
2. Review enters moderation queue
3. Admin approves or rejects
4. Published reviews update agent ratings

## 📊 Sample Data

The system comes pre-loaded with:
- 5 users (1 admin, 2 agents, 2 customers)
- 10 properties (various types and locations)
- 5 appointments (various statuses)
- 3 reviews (published and pending)
- 7 notifications

## 🎯 Features Highlights

- **4-Step Booking Flow** with progress indicator
- **Interactive Calendar** with date selection
- **Time Slot Selection** organized by day period
- **Performance Charts** for agents (bar charts)
- **Star Rating System** for reviews
- **Real-time Notifications** system
- **Search and Filter** functionality
- **Status Badges** with color coding
- **Approval Workflows** for agents and properties
- **Activity Feed** for admin dashboard

## 🔧 Customization

To customize the system:

1. **Colors:** Edit CSS variables in `css/style.css`
2. **Sample Data:** Modify `js/data.js`
3. **Validation Rules:** Update `js/utils.js`
4. **Role Permissions:** Edit `js/auth.js`

## 📝 Future Enhancements

- Real backend integration (Node.js/PHP)
- Database storage (MySQL/PostgreSQL)
- Email notifications
- SMS notifications
- Payment integration
- Advanced search with map view
- Real-time chat between customers and agents
- Document upload for properties
- Multi-language support

## 📄 License

This project is created for demonstration purposes.

## 👥 Credits

Developed for TES Real Estate
© 2025 All Rights Reserved

---

For support or questions, contact: support@tesrealestate.com
