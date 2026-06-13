# 🎓 MediCare Plus - Usage Guide

## 🚀 Getting Started

### First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:5173`
   - You'll see the landing page

## 🏠 Landing Page Navigation

### Main Sections

1. **Hero Section**
   - Click "Book Appointment" → Go to login
   - Click "Emergency" → View contact info

2. **Features Section**
   - View all available features
   - Hover over cards for animation

3. **Role Cards**
   - Click any role card → Go to login with pre-selected role
   - Available roles:
     - Patient Portal
     - Doctor Dashboard
     - Admin Panel
     - Pharmacy Module
     - Laboratory

4. **Footer**
   - Service links
   - Contact information
   - Emergency numbers

## 🔐 Login Process

### Access Different Portals

1. **Patient Portal**
   ```
   Email: patient@demo.com
   Password: demo123
   ```

2. **Doctor Portal**
   ```
   Email: doctor@demo.com
   Password: demo123
   ```

3. **Admin Panel**
   ```
   Email: admin@demo.com
   Password: demo123
   ```

4. **Pharmacy Module**
   ```
   Email: pharmacist@demo.com
   Password: demo123
   ```

5. **Lab Technician**
   ```
   Email: lab@demo.com
   Password: demo123
   ```

### Login Tips
- Click on any demo credential to auto-fill the email
- Role is selected automatically based on email
- Password is always "demo123" (pre-filled)

## 👤 Patient Portal Guide

### Dashboard Overview

#### Navigation Tabs
1. **Overview** - Health stats and quick actions
2. **Appointments** - Manage all appointments
3. **Prescriptions** - View all prescriptions
4. **Lab Reports** - Access test results
5. **Orders** - Track medicine orders

### Using Patient Features

#### 1. View Appointments
- Click "Appointments" tab
- See upcoming appointments (green section)
- View past appointments (gray section)
- Actions available:
  - Reschedule
  - Cancel
  - Join Video Call (for video consultations)

#### 2. Find Doctors
- Click "Find Doctors" in sidebar
- Use search bar for name/specialization
- Apply filters:
  - Specialization dropdown
  - Location field
- View doctor details:
  - Experience
  - Ratings & Reviews
  - Fees
  - Availability
- Click "Book Appointment" to schedule
- Click video icon for video consultation

#### 3. View Prescriptions
- Click "Prescriptions" tab
- See all prescriptions with:
  - Diagnosis
  - Medicine list
  - Dosage instructions
- Click "Download" to get PDF (demo)
- Click "Order These Medicines" to buy

#### 4. Lab Reports
- Click "Lab Reports" tab
- View completed tests
- See pending tests
- Click "Download Report" for results
- Click "Book Lab Test" for new tests

#### 5. Medicine Orders
- Click "Orders" tab
- Track order status
- View order details
- Click "Track Order" for shipped items

## 👨‍⚕️ Doctor Portal Guide

### Dashboard Features

#### Top Statistics
- Today's Appointments
- Total Patients
- Monthly Earnings
- Average Consultation Time

#### Today's Schedule
- View all appointments
- See patient details
- Quick actions:
  - View patient history
  - Start video call
  - Add notes

#### Quick Actions
1. **New Prescription**
   - Create prescription
   - Add medicines
   - Save templates

2. **Set Availability**
   - Update schedule
   - Block time slots

3. **Start Consultation**
   - Begin video call
   - Access patient records

#### Performance Metrics
- Patient Satisfaction (4.8/5)
- Appointments Completed (95%)
- Response Time (Excellent)

### Navigation Options
- **Dashboard** - Overview
- **Appointments** - Schedule management
- **Patients** - Patient records
- **Prescriptions** - Prescription history
- **Earnings** - Revenue tracking
- **Availability** - Calendar management

## 🔧 Admin Panel Guide

### Dashboard Overview

#### Key Statistics
- Total Patients: 2,543
- Appointments Today: 48
- Monthly Revenue: $124,500
- Available Beds: Count by type

#### Analytics Charts
1. **Weekly Appointments**
   - Bar chart showing daily appointments
   - Hover for exact numbers

2. **Revenue Trend**
   - Line chart showing monthly growth
   - 6-month overview

#### Bed Management
- **ICU Beds**
  - Available count
  - Occupied count
  - Utilization percentage

- **Private Rooms**
  - Same metrics as ICU

- **General Wards**
  - Complete bed status

#### Recent Activity
- Latest appointments
- Patient-doctor pairings
- Time and date info

#### Inventory Alerts
- Low stock medicines
- Batch numbers
- Reorder functionality

### Admin Navigation
- **Dashboard** - Main overview
- **Users** - Manage all users
- **Appointments** - All bookings
- **Beds** - Bed allocation
- **Analytics** - Detailed reports
- **Billing** - Financial management
- **Settings** - System configuration

## 💊 Pharmacy Module Guide

### Dashboard Features

#### Statistics
- Total Medicines: 5 items
- Monthly Sales: $45,230
- Low Stock Items: Count
- Active Orders: Count

#### Low Stock Alerts
- Red/orange indicators
- Medicine name and batch
- Current quantity
- Reorder button

#### Expiring Soon
- Items expiring in 6 months
- Expiry dates shown
- Quantity tracking

#### Recent Orders
- Order number and date
- Item count
- Total amount
- Status badges:
  - Pending (yellow)
  - Shipped (blue)
  - Delivered (green)

### Navigation
- **Dashboard** - Overview
- **Inventory** - All medicines
- **Orders** - Process orders
- **Suppliers** - Supplier management
- **Sales** - Sales reports

## 🧪 Laboratory Guide

### Dashboard Features

#### Statistics
- Total Tests
- Pending Tests
- Completed Tests
- Reports Generated

#### Test Management
- View all tests
- Upload results for pending tests
- View completed reports
- Patient information
- Test dates

### Actions
- **Pending Tests**
  - Click "Upload Results"
  - Enter test values
  - Generate report

- **Completed Tests**
  - Click "View Report"
  - Download PDF
  - Share with patient

### Navigation
- **Dashboard** - Overview
- **Tests** - Test catalog
- **Reports** - All reports
- **Appointments** - Lab bookings

## 🎨 UI Features

### Sidebar Navigation
- **Desktop**: Collapsible sidebar
  - Click X icon to collapse
  - Click Menu icon to expand
  
- **Mobile**: Drawer menu
  - Click hamburger icon to open
  - Click X or outside to close

### Notifications
- Bell icon in top navbar
- Red dot indicates unread
- Click to view notifications

### User Profile
- Avatar in top-right
- Name and role displayed
- Click for profile options

### Logout
- Sidebar bottom: Logout button
- Mobile menu: Logout option
- Redirects to landing page

## 🎯 Tips & Tricks

### 1. Quick Navigation
- Use sidebar for main sections
- Click logo to go to dashboard
- Use browser back button

### 2. Search & Filter
- Search updates in real-time
- Clear filters to see all results
- Combine multiple filters

### 3. Viewing Details
- Hover over cards for more info
- Click anywhere on card to open
- Look for action buttons

### 4. Charts
- Hover over bars/lines for exact values
- Charts are responsive
- Auto-scales to data

### 5. Status Colors
- 🔵 Blue: Scheduled/Shipped
- 🟢 Green: Completed/Delivered
- 🟡 Yellow: Pending
- 🔴 Red: Cancelled/Alert
- 🟠 Orange: Warning

## 📱 Mobile Usage

### Mobile Features
1. **Hamburger Menu**
   - Top-left corner
   - Access all navigation

2. **Touch Friendly**
   - Large tap targets
   - Swipe gestures ready

3. **Responsive Layouts**
   - Single column on mobile
   - Stacked cards
   - Full-width forms

## 🔄 Data Flow

### Understanding Mock Data
- All data is stored locally
- Changes persist in session
- Refresh clears data
- Production would use API

### Demo Limitations
- No actual video calls
- No real payments
- No file uploads
- No email/SMS

## 🐛 Troubleshooting

### Common Issues

1. **Login Issues**
   - Use exact demo credentials
   - Check role selection
   - Clear browser cache

2. **Blank Dashboard**
   - Refresh page
   - Check console for errors
   - Verify you're logged in

3. **Charts Not Showing**
   - Wait for data to load
   - Check browser compatibility
   - Ensure JavaScript enabled

4. **Mobile Menu Stuck**
   - Click X to close
   - Refresh page if needed

## 🎓 Learning Features

### For Developers

1. **Code Structure**
   - Check `src/` folder
   - Review component hierarchy
   - Study routing in App.tsx

2. **Styling**
   - Tailwind CSS classes
   - Framer Motion animations
   - Responsive patterns

3. **State Management**
   - AuthContext for auth
   - React hooks
   - Local state

4. **Data Modeling**
   - TypeScript interfaces
   - Mock data structure
   - Type safety

## 📊 Demo Scenarios

### Test These Workflows

1. **Patient Booking**
   - Login as patient
   - Find doctors
   - Book appointment
   - View confirmation

2. **Doctor Workflow**
   - Login as doctor
   - View appointments
   - Check performance
   - Quick actions

3. **Admin Oversight**
   - Login as admin
   - View analytics
   - Check bed status
   - Monitor inventory

4. **Pharmacy Operations**
   - Login as pharmacist
   - Check low stock
   - View orders
   - Track expiry

5. **Lab Processing**
   - Login as lab tech
   - View pending tests
   - Upload results
   - Generate reports

## 🎉 Enjoy Exploring!

This system demonstrates a complete hospital management platform with:
- 5 user roles
- 50+ features
- Beautiful animations
- Responsive design
- Type-safe code

Perfect for portfolios, learning, or as a foundation for real projects!

---

**Questions or Issues?**
Check README.md for technical details or FEATURES.md for complete feature list.
