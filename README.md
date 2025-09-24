# Collaborative Drawing Board

A real-time collaborative drawing application built with React, TypeScript, and modern web technologies. This application allows multiple users to draw together on a shared canvas in real-time, with support for both registered users and anonymous guests.

## Current Development Status

This project is currently in active development with the following phases completed:

### Phase 1: Project Setup (Complete)
- React 18 with TypeScript configuration
- Vite build system and development server
- Tailwind CSS for styling with forms plugin
- ESLint configuration for code quality
- Project structure with organized folders
- Socket.io client for real-time communication
- Zustand for state management
- React Router for navigation

### Phase 2: Authentication Foundation (Complete)
- Complete authentication system with JWT token support
- User registration and login with form validation
- Anonymous user support ("Continue as Guest" functionality)
- Protected route system for authenticated content
- Persistent authentication state using localStorage
- User context provider for application-wide auth state
- Navigation component with user status display
- Public landing page with feature showcase
- Protected dashboard for authenticated users

## Features

### Authentication System
- **User Registration**: Complete signup flow with form validation including name, email, password, and password confirmation
- **User Login**: Email/password authentication with error handling and loading states
- **Anonymous Access**: Guest users can access the application without creating an account
- **Token Management**: JWT token storage with automatic expiration handling
- **Protected Routes**: Automatic redirection based on authentication status
- **Session Persistence**: User sessions persist across browser refreshes

### User Interface
- **Landing Page**: Public homepage with feature highlights and call-to-action buttons
- **Authentication Forms**: Clean, responsive login and signup forms with real-time validation
- **Dashboard**: Personalized dashboard for authenticated users showing account status and quick actions
- **Navigation**: Context-aware navigation showing user status and logout options
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

### Security Features
- **Form Validation**: Client-side validation for all authentication forms
- **Token Expiration**: Automatic cleanup of expired authentication tokens
- **Route Protection**: Unauthorized users are redirected to appropriate pages
- **Error Handling**: Comprehensive error messages for authentication failures

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast development server and optimized production builds
- **React Router**: Client-side routing with protected route support
- **Zustand**: Lightweight state management for authentication and application state

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Tailwind Forms**: Enhanced form styling and components
- **PostCSS**: CSS processing and optimization

### Development Tools
- **ESLint**: Code linting with React and TypeScript rules
- **TypeScript Compiler**: Type checking and compilation
- **npm**: Package management and script execution

### Libraries
- **jwt-decode**: JWT token decoding and validation
- **Socket.io Client**: Prepared for real-time communication
- **UUID**: Unique identifier generation

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication-specific components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── Navigation.tsx   # Main navigation component
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── index.ts         # Component exports
├── contexts/            # React contexts
│   ├── AuthContext.ts   # Authentication context definition
│   ├── AuthProvider.tsx # Authentication context provider
│   └── index.ts         # Context exports
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook
│   ├── useAuthStore.ts  # Zustand auth store
│   ├── useDrawingStore.ts # Drawing state management
│   ├── useRoomStore.ts  # Room state management
│   └── index.ts         # Hook exports
├── pages/               # Application pages
│   ├── HomePage.tsx     # Public landing page
│   ├── LoginPage.tsx    # Authentication page
│   ├── DashboardPage.tsx # User dashboard
│   ├── RoomPage.tsx     # Drawing room (prepared)
│   └── index.ts         # Page exports
├── services/            # API and external services
│   └── index.ts         # Service exports
├── types/               # TypeScript type definitions
│   └── index.ts         # Global types
├── utils/               # Utility functions
│   ├── auth.ts          # Authentication utilities
│   └── index.ts         # Utility exports
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Usage

### For End Users

1. **Visit the Landing Page**: Navigate to the application URL to see the feature overview
2. **Create an Account**: Click "Get Started" and fill out the registration form
3. **Or Continue as Guest**: Use the "Continue as Guest" option for anonymous access
4. **Access Dashboard**: After authentication, view your personalized dashboard
5. **Navigate Features**: Use the navigation bar to access different parts of the application

### For Developers

The application uses a modern React architecture with the following patterns:

- **Component Composition**: Small, reusable components with clear responsibilities
- **Custom Hooks**: Encapsulated state logic and side effects
- **Context Providers**: Global state management for authentication
- **Protected Routes**: Route-level authentication guards
- **Type Safety**: Comprehensive TypeScript coverage

## Authentication Flow

1. **Anonymous Access**: Users can access the landing page without authentication
2. **Registration**: New users create accounts with email, name, and password
3. **Login**: Existing users authenticate with email and password
4. **Token Storage**: JWT tokens are stored securely in localStorage
5. **Session Management**: Tokens are validated on each page load
6. **Logout**: Tokens are cleared and users are redirected appropriately

## Future Development

The application is prepared for the following upcoming features:

### Phase 3: Real-time Drawing (Planned)
- Canvas component for drawing
- Real-time synchronization using Socket.io
- Drawing tools (brush, eraser, colors, sizes)
- Multi-user cursor tracking

### Phase 4: Room Management (Planned)
- Room creation and joining
- Room codes for easy sharing
- User presence indicators
- Room-based permissions

### Phase 5: Enhanced Features (Planned)
- Drawing history and undo/redo
- Save and export drawings
- Advanced drawing tools
- User profiles and preferences

## Contributing

This project follows standard React and TypeScript development practices. When contributing:

1. Maintain type safety throughout
2. Follow the existing component structure
3. Add proper error handling
4. Include form validation where appropriate
5. Test authentication flows thoroughly

## Development Notes

- The application uses mock authentication for development purposes
- JWT tokens are base64 encoded for demo functionality
- Real backend integration points are clearly marked in the code
- All authentication state is managed through Zustand stores
- Form validation includes both client-side and error display logic
