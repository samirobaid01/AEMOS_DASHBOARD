# AEMOS Agriculture Dashboard

![AEMOS Agriculture](https://via.placeholder.com/800x200/16a34a/FFFFFF?text=AEMOS+Agriculture)

## Overview

AEMOS Agriculture Dashboard is a comprehensive agricultural monitoring system designed to help farmers and agricultural businesses track, manage, and analyze data from various sensors and devices deployed across different areas and organizations. The platform provides real-time insights and visualization of agricultural metrics to optimize farming operations.

## Key Features

- **Organization Management**: Create and manage multiple organizations with customizable settings
- **Area Monitoring**: Define specific areas within organizations for focused monitoring
- **Device Tracking**: Register and monitor IoT devices deployed in the field
- **Sensor Data**: Collect and visualize data from various types of agricultural sensors
- **Dashboard Analytics**: Real-time analytics and data visualization
- **User Authentication**: Secure login, signup, and profile management
- **Dark Mode Support**: Fully customizable light and dark themes
- **Guided Tours**: Interactive walkthroughs to help users learn the platform
- **Multi-language Support**: Internationalization ready with i18n

## Technologies

The AEMOS Dashboard is built with a modern tech stack:

- **Frontend Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router 7
- **Styling**: Tailwind CSS with dark mode support
- **Internationalization**: i18next
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Responsive Design

The application is fully responsive and optimized for both desktop and mobile devices:

- **Desktop**: Full-featured interface with persistent sidebar navigation
- **Mobile**: Optimized layout with collapsible sidebar and touch-friendly controls
- **Responsive Components**: All UI components adapt to different screen sizes
- **Adaptive Typography**: Font sizes adjust based on viewport size

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/aemos-dashboard.git

# Navigate to the project directory
cd aemos-dashboard

# Install dependencies
npm install

# Generate barrel files (export indices)
npm run generate-barrels

# Start the development server
npm run dev
```

### Development Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint to check code quality
- `npm run preview`: Preview the production build locally
- `npm run dev:setup`: Generate barrel files and start development server

## Project Structure

```
src/
├── assets/         # Static assets (images, icons)
├── components/     # Presentation components
│   ├── common/     # Shared UI components
│   ├── dashboard/  # Dashboard-specific components
│   ├── layout/     # Layout components (MainLayout)
│   └── ...         # Feature-specific components
├── containers/     # Container components with business logic
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── i18n/           # Internationalization resources
├── routes/         # Routing configuration
├── services/       # API services and data fetching
├── state/          # Redux store and slices
├── styles/         # Global styles and theme definitions
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Architecture

The application follows a clean separation of concerns with a container/presentation pattern:

- **Container Components**: Handle data fetching, state management, and business logic
- **Presentation Components**: Focus on rendering UI based on passed props
- **Context Providers**: Manage global state like theming and walkthroughs
- **Redux Store**: Centralized state management for auth and data
- **Custom Hooks**: Encapsulate reusable logic

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
