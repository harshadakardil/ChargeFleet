# ChargeFleet - Charging Station Management System

A full-stack web application for managing electric vehicle charging stations with real-time monitoring, interactive mapping, and fleet management capabilities.

![ChargeFleet Dashboard](https://via.placeholder.com/800x400/1976D2/FFFFFF?text=ChargeFleet+Dashboard)

## 🚀 Features

### 🔐 Authentication & Security
- **JWT-based Authentication** - Secure user registration and login
- **Protected Routes** - All station management features require authentication
- **Password Hashing** - Secure password storage with bcrypt

### ⚡ Station Management
- **CRUD Operations** - Create, read, update, and delete charging stations
- **Real-time Statistics** - Live dashboard with station metrics
- **Advanced Filtering** - Filter by status, power output, and connector type
- **Status Tracking** - Active, inactive, and maintenance status monitoring

### 🗺️ Interactive Mapping
- **Visual Station Locations** - Interactive map view of all stations
- **Station Details** - Click markers to view detailed information
- **Real-time Updates** - Map reflects current station status with color coding

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark/Light Mode Support** - Built-in theme switching capability
- **Component Library** - Professional UI components with shadcn/ui
- **Real-time Notifications** - Toast notifications for user actions

## 🛠️ Technology Stack

### Backend
- **Node.js & Express** - RESTful API server
- **PostgreSQL** - Primary database with Drizzle ORM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security
- **Zod** - Runtime type validation

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **TanStack Query** - Server state management
- **Wouter** - Lightweight client-side routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library

### Database Schema
```sql
-- Users table
users (
  id: serial primary key,
  username: text unique not null,
  email: text unique not null,
  password: text not null,
  created_at: timestamp default now()
)

-- Charging stations table
charging_stations (
  id: serial primary key,
  name: text not null,
  address: text not null,
  latitude: decimal(10,7) not null,
  longitude: decimal(10,7) not null,
  status: text not null, -- 'active', 'inactive', 'maintenance'
  power_output: integer not null, -- in kW
  connector_type: text not null, -- 'type1', 'type2', 'ccs', 'chademo'
  user_id: integer references users(id),
  created_at: timestamp default now(),
  updated_at: timestamp default now()
)
```
## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chargefleet
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/chargefleet
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=chargefleet

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key

# Application Configuration
NODE_ENV=development
PORT=5000
```
### 4. Database Setup
```bash
# Push database schema
npm run db:push

# Optional: View database in browser
npm run db:studio
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com", 
  "password": "securepassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

### Station Management Endpoints

#### Get All Stations
```http
GET /api/stations
Authorization: Bearer <jwt_token>
```

#### Get Single Station
```http
GET /api/stations/:id
Authorization: Bearer <jwt_token>
```

#### Create Station
```http
POST /api/stations
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Downtown Charging Hub",
  "address": "123 Main St, City, State 12345",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "status": "active",
  "powerOutput": 150,
  "connectorType": "ccs"
}
```
#### Update Station
```http
PUT /api/stations/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Station Name",
  "status": "maintenance"
}
```

#### Delete Station
```http
DELETE /api/stations/:id
Authorization: Bearer <jwt_token>
```

## 🏗️ Project Structure

```

chargefleet/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── layout/     # Layout components (sidebar, topbar)
│   │   │   ├── stations/   # Station-specific components
│   │   │   ├── map/        # Map view components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configs
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection and setup
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database storage layer
│   ├── index.ts           # Express server entry point
│   └── vite.ts            # Vite integration for development
├── shared/                 # Shared TypeScript types and schemas
│   └── schema.ts          # Drizzle database schema and Zod validation
├── package.json           # Dependencies and scripts
├── drizzle.config.ts      # Drizzle ORM configuration
├── vite.config.ts         # Vite build configuration
└── tailwind.config.ts     # Tailwind CSS configuration
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

### Build for Production
```bash
npm run build
npm start
```

### Deployment Platforms
This application is ready to deploy on:
- **Vercel** - Automatic deployment from Git
- **Render** - Full-stack application hosting
- **Railway** - Database and application hosting
- **Heroku** - Container-based deployment
- **AWS/GCP/Azure** - Cloud platform deployment

## 🧪 Testing the Application

### 1. User Registration & Authentication
1. Navigate to the login page
2. Click "Sign Up" tab
3. Create a new account with username, email, and password
4. Login with your credentials

### 2. Station Management
1. Click "Add Station" to create a new charging station
2. Fill in all required fields (name, address, coordinates, power, etc.)
3. Use filters to find stations by status, power output, or connector type
4. Edit existing stations by clicking the edit icon
5. Delete stations using the trash icon

### 3. Map Visualization
1. Navigate to "Map View" from the sidebar
2. View all stations plotted on the interactive map
3. Click station markers to see detailed information
4. Observe color coding for different station statuses

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push database schema changes
npm run db:push

# Open database studio
npm run db:studio

# Type checking
npm run type-check

# Linting
npm run lint
```


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🎯 Future Enhancements

- [ ] Real-time station monitoring with WebSockets
- [ ] Mobile application (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with payment systems
- [ ] Multi-tenant support for fleet operators
- [ ] Reservation system for charging slots
- [ ] Integration with external mapping services (Google Maps, OpenStreetMap)
- [ ] Automated maintenance scheduling
- [ ] Load balancing and scaling optimizations

---

**ChargeFleet** - Empowering the future of electric vehicle infrastructure management.

