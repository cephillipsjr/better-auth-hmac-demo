# Better Auth Email/Password Starter

This is a minimalist Better Auth starter project using [Next.js 15](https://nextjs.org), built to demonstrate a secure, email-password-based authentication flow. It includes a plugin that verifies HMAC-signed requests and blocks unauthorized access (like Postman or curl without valid headers).

## Getting Started

Here’s how you can get the app running locally:

### Prerequisites

1. **Clone the repo**:

   ```bash
   git clone https://github.com/cephillipsjr/better-auth-hmac-demo
   cd better-auth-hmac-demo
   ```

2. **Install the dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up your environment variables**:

   - Rename the `.env.example` file to `.env`:

     ```bash
     cp .env.example .env
     ```

Then update the values in .env, including:

    - SIGNED_SECRET – shared secret for HMAC signing
    - HMAC_HEADER* - used to rotate header keys
    - REDIS_URL – Redis instance for nonce storage

4.  **Start Redis (if not already running)**:

If you don’t already have Redis installed, you can run it via Docker:

     ```bash
     docker run -d -p 6379:6379 redis
     ```

Or install it locally:

     ```bash
    brew install redis
    brew services start redis
     ````

### Start the Development Server

Once everything is set up, start the development server with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app will be live at [http://localhost:3000](http://localhost:3000). Open it in your browser, and you’re good to go!

## Features

Here’s what this app supports out of the box:

- **Email & Password Sign In & Sign Up**
- **Secure Server Action via HMAC-signed requests**
- **Custom Better Auth Plugin** to verify signature, timestamp and nonce.
- **Redis Nonce Validation** to block replay attacks.
- **Middleware-based Route Protection**
- **ENV-rotatable Header Keys for Signature**

## How HMAC Protection Works

To successfully call a protected Better Auth endpoint (like sign-in or sign-up) using Postman, you must include three custom headers in your request:

- x-request-signature – an HMAC hash of the request payload using a secret key
- x-request-timestamp – a UNIX timestamp at the time the request is generated
- x-nonce-id – a unique random identifier to prevent replay attacks

These three values must be tightly coupled. The signature is computed from the exact body, timestamp, and nonce using a shared secret only known to the client and server.

## Why this matters

An attacker using Postman or curl cannot forge a valid request unless they have:

- 1. The exact same HMAC secret as your backend (SIGNED_SECRET)
- 2. A correctly timestamped request (within your TTL window, e.g., 5 minutes)
- 3. A unique nonce that hasn’t already been used (if you track them via Redis or similar)
- 4. A matching request body — even an extra space will result in signature mismatch

If any part is incorrect, the server will reject the request with an invalid signature or expired/reused nonce error. This protects your Server Actions from being hit directly without going through your frontend or trusted client.

This app includes a Better Auth plugin that enforces signed requests for sensitive actions like login, signup, and signout. Every server action:

- Signs the request body using a shared secret
- Attaches x-signature, x-timestamp, and x-nonce headers
- The plugin verifies the signature, timestamp, and ensures the nonce hasn't been reused
- Prevents tools like Postman/curl unless they have all required parts

This secures public-facing server actions from unauthorized access.
