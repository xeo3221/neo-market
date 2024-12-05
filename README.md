# Neo Market

A modern full-stack e-commerce web application built with Next.js, Clerk, Neon (PostgreSQL), Drizzle ORM, and TypeScript, styled using TailwindCSS and ShadCN. The app offers a seamless experience for purchasing and managing collectible cards, featuring secure user authentication, real-time cart functionality, and robust payment integration via Stripe. Clerk handles authentication, while Neon and Drizzle ensure efficient data management. Designed for scalability and ease of use, the app provides a strong foundation for modern e-commerce projects focused on performance and security.

- https://neo-market-gamma.vercel.app/

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#-tech-stack">Tech Stack</a>
    </li>
    <li>
      <a href="#-features">Features</a>
    </li>
    <li>
      <a href="#-getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#-key-components">Key Components</a></li>
    <li><a href="#-custom-hooks">Custom Hooks</a></li>
    <li><a href="#-database-schema">Database Schema</a></li>
    <li><a href="#-design">Design</a></li>
    <li><a href="#-future-improvements">Future Improvements</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: PostgreSQL (with Drizzle ORM)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN
- **Payment**: Stripe
- **Data Fetching**: TanStack Query

## 🛠 Getting Started

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. **Clone the repository**

```sh
git clone https://github.com/xeo3221/neo-market.git
cd neo-market
```

2. **Install dependencies**

```sh
npm install
```

- or

```sh
yarn install
```

- or

```sh
pnpm install
```

3. **Set up environment variables**

```sh
cp .env.example .env.local
```

Fill in the required environment variables:

- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`

4. **Run database migrations**

```sh
npm run db:migrate
```

5. **Start the development server**

```sh
npm run dev
```

## 🌟 Features

- **Authentication & Authorization**

  - Secure user authentication with Clerk
  - Protected routes and API endpoints
  - Social login support (Google, GitHub)

- **Marketplace**

  - Browse and purchase digital cards/items
  - Advanced filtering and search capabilities
  - Real-time inventory management

- **Shopping Cart**

  - Add/remove items
  - Quantity management
  - Persistent cart state

- **User Dashboard**

  - Inventory management
  - Transaction history
  - Activity charts and statistics

- **Payment Integration**
  - Secure checkout with Stripe
  - Transaction history tracking

## 📦 Key Components

- `ForgotPasswordForm`: Password recovery flow
- `LoginForm`: User authentication
- `RegisterForm`: New user registration
- `CartTable`: Shopping cart management
- `InventoryFilterBar`: Inventory filtering
- `MarketplaceSidebarContent`: Marketplace navigation
- `Charts`: Various data visualization components

## 🪝 Custom Hooks

- `useAuth`: Authentication state management
- `useCart`: Shopping cart operations
- `useInventory`: Inventory management
- `useItems`: Item filtering and search
- `useTransactions`: Transaction history
- `useToast`: Toast notifications

## 📝 Database Schema

The application uses a PostgreSQL database with the following main tables:

- `users`: User profiles
- `cards`: Digital cards/items
- `transactions`: Purchase history
- `user_cards`: User inventory

## 🎨 Design

### Landing Page

![Landing Page](https://i.imgur.com/XYZ123.png)

### Marketplace

![Marketplace](https://i.imgur.com/XYZ124.png)

### Inventory

![Inventory](https://i.imgur.com/XYZ125.png)

### Cart & Checkout

![Cart](https://i.imgur.com/XYZ126.png)

## 🔮 Future Improvements

- **Enhanced Social Features**

  - Trading system between users
  - Comments and ratings on cards

- **Advanced Marketplace Features**

  - Auction system for rare cards
  - Time-limited special offers

- **Community Features**
  - Achievement system

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)
- [Neon](https://neon.tech)
- [Drizzle](https://orm.drizzle.team/)
