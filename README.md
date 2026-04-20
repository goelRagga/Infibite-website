## ELIVAAS - Luxury Villa Rental Platform

A modern Next.js application for luxury villa rentals and vacation bookings.

### 🚀 Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Performance Optimized**: Image optimization, code splitting, lazy loading
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Auth0 integration for secure user management
- **GraphQL API**: Apollo Client for efficient data fetching
- **Payment Integration**: Multiple payment gateways support
- **Real-time Features**: Dynamic pricing and availability updates

### 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Context + Custom Hooks
- **API**: GraphQL with Apollo Client
- **Authentication**: Auth0
- **Payment**: Cashfree, Razorpay
- **Analytics**: Mixpanel

### 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd elivaas-new
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables:

   ```env
   # Auth0 Configuration
   AUTH0_SECRET=your_auth0_secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=your_auth0_domain
   AUTH0_CLIENT_ID=your_auth0_client_id
   AUTH0_CLIENT_SECRET=your_auth0_client_secret

   # GraphQL Configuration
   GRAPHQL_URL=your_graphql_endpoint
   GRAPHQL_TOKEN=your_graphql_token

   # Image Configuration
   IMAGE_DOMAIN=your_image_domain

   # Payment Configuration
   CASHFREE_MODE=TEST
   RAZORPAY_KEY=your_razorpay_key

   # Analytics
   GTM_ID=your_gtm_id
   NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser** Navigate to
   [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
elivaas-new/
├── app/                    # Next.js App Router pages
│   ├── [property]/        # Dynamic property routes
│   ├── account/           # User account pages
│   ├── booking/           # Booking flow pages
│   └── villas/            # Villa listing pages
├── components/            # Reusable components
│   ├── common/           # Shared components
│   ├── modules/          # Feature-specific modules
│   └── ui/               # Base UI components
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── api/             # API functions
│   ├── apollo/          # GraphQL client setup
│   └── utils/           # Utility functions
├── public/              # Static assets
└── utils/               # Additional utilities
```

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js Image component with WebP format
- **Code Splitting**: Dynamic imports for route-based splitting
- **Bundle Optimization**: Webpack optimizations for package imports
- **Caching**: Strategic caching for static assets and API responses
- **Lazy Loading**: Suspense boundaries for better loading experience

## 🔒 Security

- **Authentication**: Auth0 for secure user authentication
- **Environment Variables**: Secure handling of sensitive data
- **Input Validation**: TypeScript for compile-time type safety
- **HTTPS**: Enforced HTTPS in production
- **CORS**: Proper CORS configuration

## 📊 Monitoring & Analytics

- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Comprehensive error handling
- **User Analytics**: Mixpanel integration
- **SEO**: Meta tags and structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure responsive design
- Optimize for performance

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

- Email: support@elivaas.com
- Documentation: [docs.elivaas.com](https://docs.elivaas.com)
- Issues: [GitHub Issues](https://github.com/elivaas/elivaas-new/issues)
