# SIWF v2 Demo Implementation

This is a minimal implementation of Sign-In With Frequency (SIWF) v2 using React, TypeScript, and Vite. The project demonstrates wallet-based authentication using both Polkadot and Metamask wallets.

## Features

- SIWF v2 authentication flow
- Polkadot wallet integration
- Metamask wallet integration
- Protected routes
- Simple dashboard interface

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- A Polkadot wallet extension (e.g., Polkadot.js)
- Metamask extension

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
  ├── components/         # React components
  │   ├── LoginPage.tsx  # Login page with wallet connections
  │   └── DashboardPage.tsx  # Protected dashboard page
  ├── services/          # API and wallet services
  │   ├── AuthService.ts # Authentication service
  │   └── WalletService.ts  # Wallet connection handlers
  ├── types/            # TypeScript type definitions
  │   └── auth.ts      # Auth-related types
  ├── App.tsx          # Main application component
  └── index.tsx        # Application entry point
```

## Implementation Notes

- The Polkadot message signing implementation is currently a placeholder and needs to be implemented based on your specific requirements.
- The backend API endpoints are expected to be running on `http://localhost:3001`. Update the `API_BASE_URL` in `AuthService.ts` if your backend is running on a different port.
- This is a minimal implementation focused on the authentication flow. Additional features like error handling, loading states, and proper session management should be added for production use.

## Backend Requirements

The backend should implement the following endpoints:

- `GET /auth/login/v2/siwf` - Initialize SIWF login
- `POST /auth/login/v2/siwf/verify` - Verify authentication
- `POST /auth/login` - Handle wallet login
- `GET /auth/account` - Get account status
- `POST /auth/logout` - Handle logout

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
