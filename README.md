# SharedTab - Simplified Group Expense Sharing

Managing shared expenses with friends, roommates, or colleagues can quickly become a hassle. SharedTab simplifies the process, allowing you to create groups, add members, track expenses, and settle debts—without the need for logins or registrations. Whether you're splitting dinner bills, rent, or group trip expenses, SharedTab keeps everything organized and fair.

## Key Features

### Create Groups Easily
Start by creating a group for any shared expenses. Whether it's a vacation fund, household costs, or a weekend getaway, you can add members effortlessly.

### No Registration Needed
Forget about signing up or remembering passwords. SharedTab requires no logins, making it quick and hassle-free for everyone to join and contribute.

### Add Members Instantly
Just share a private link with friends or roommates—they can join the group and add expenses without needing to create an account.

### Track Expenses Transparently
Every expense added to the group is recorded, and balances are updated instantly. Members can see who paid what and how much each person owes, making it easy to settle up.

### Share Links Privately
Each group has a unique private link that can be shared securely among members. Only those with the link can access the group's expense log, ensuring privacy.

### Trust-Based Logging
SharedTab provides a basic log of transactions, but it operates on a trust-based system. Members are expected to enter expenses honestly, making it an easy and lightweight solution for tracking shared costs.

## Getting Started

### Environment Setup

Before running the project, you need to set up your environment variables:

1. Copy the `.env.example` file to a new file named `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your specific configuration values:
   - Set your `DATABASE_URL` with the correct database credentials
   - Configure any additional environment variables required for your project

The application requires these environment variables to connect to the database and other services properly.

### Running the Development Server

Run the development server with one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

The project includes both unit tests and end-to-end tests. Here's how to run them:

### Unit Tests

```bash
npm run test          # Run unit tests once
npm run test:watch   # Run unit tests in watch mode
```

### E2E Tests

```bash
npm run cypress       # Open Cypress interactive mode
npm run cypress:e2e  # Start dev server and open Cypress
```

### Run All Tests

```bash
npm run test:all     # Runs both unit and E2E tests
```

Note: The project is configured with GitHub Actions to automatically run tests on push and pull requests to the main branch.

## Roadmap

Here are some of the planned features and improvements:

### Coming Soon

- 🌐 Multi-language Support
  - Multiple language options
  - RTL support
  - Automatic language detection
- 👤 User Authentication
  - User registration and login
  - OAuth integration
  - Profile management
- 🎨 Enhanced User Experience
  - Dark/Light theme
  - Customizable UI
- 🔒 Security Features
  - End-to-end encryption

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT License

Copyright (c) 2024 Shared Tab

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
