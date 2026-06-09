# C2C Marketplace

A consumer-to-consumer (C2C) marketplace mobile app built with **React Native**. Browse second-hand listings, search for items, favorite the ones you like, view seller profiles, and list your own items for sale — all backed by in-memory mock data so the app runs without any external services.

> This is a demo/learning app. There is no real backend — authentication, listings, and favorites all live in memory and reset when the app restarts.

---

## Tech Stack

- **React Native** 0.84
- **React** 19
- **React Navigation** 7 (native stack + bottom tabs)
- **TypeScript**
- In-memory React Context for state (Auth, Listings, Favorites)

---

## Prerequisites

Make sure the following are installed before you start. If you're new to React Native, follow the official [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide first.

| Tool | Notes |
| --- | --- |
| **Node.js** | v20+ (the project's `package.json` recommends `>= 22.11.0`) |
| **npm** | Comes with Node |
| **Watchman** | Recommended on macOS: `brew install watchman` |
| **Ruby + Bundler** | Used to install CocoaPods (`gem install bundler`) |
| **CocoaPods** | Installed via Bundler (see below) |
| **Xcode** | 15+ with Command Line Tools, for the iOS Simulator |

> **iOS only.** These instructions cover running the app on the iOS Simulator (macOS). The project also contains an Android project, but it has not been verified here.

---

## Getting Started

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd dummy-c2c-react-native-app
```

### 2. Install JavaScript dependencies

```sh
npm install
```

### 3. Install iOS native dependencies (CocoaPods)

The first time (installs CocoaPods itself via Bundler), then installs the pods:

```sh
bundle install
bundle exec pod install --project-directory=ios
```

> Run `bundle exec pod install` again any time native dependencies change.

### 4. Start Metro (the JS bundler)

In one terminal, from the project root:

```sh
npm start
```

### 5. Build and run the iOS app

In a second terminal, from the project root:

```sh
npm run ios
```

This builds the app, boots the iOS Simulator, installs the app, and launches it. To target a specific simulator:

```sh
npm run ios -- --simulator "iPhone 17 Pro"
```

Once it launches you'll see the **C2C Marketplace** login screen.

---

## Logging In (Sample Users)

There is no sign-up — log in with one of the seeded sample accounts below. **Every account uses the same password:**

```
Password: password123
```

The login form is **pre-filled** with `user1@test.com` / `password123`, so you can simply tap **Login** to get started.

| Email | Password | Name |
| --- | --- | --- |
| `user1@test.com` | `password123` | Aiko Tanaka |
| `user2@test.com` | `password123` | Kenji Sato |
| `user3@test.com` | `password123` | Mina Kobayashi |
| `user4@test.com` | `password123` | Haru Suzuki |
| `user5@test.com` | `password123` | Yui Nakamura |
| `user6@test.com` | `password123` | Riku Ito |
| `user7@test.com` | `password123` | Sora Watanabe |
| `user8@test.com` | `password123` | Emi Yamamoto |
| `user9@test.com` | `password123` | Daichi Mori |
| `user10@test.com` | `password123` | Nana Hayashi |

Each seller owns a slice of the seeded listings, so logging in as different users (and viewing their seller profiles) shows different inventories.

---

## Features

- **Login / Logout** — Email + password authentication against the seeded sample users, with an inline error for invalid credentials. Log out from the Profile tab.
- **Home / Browse Listings** — A two-column grid of ~50 seeded items (sneakers, electronics, home goods, books, beauty, and more), each showing photo, title, and price.
- **Search** — Filter listings live by title from the search bar; an empty state appears when nothing matches.
- **Product Detail** — Tap any item to see its photo, price, condition, category, description, and the seller. Items that are no longer available show a **SOLD** badge.
- **Favorites** — Tap the heart on a listing or detail screen to favorite/unfavorite it. The **Favorites** tab collects everything you've saved, with an empty state when you have none.
- **Seller Profiles** — From a product, open the seller to view their avatar, name, join date, bio, and all of their other listings.
- **Create Listing (Sell)** — From the **Sell an Item** tab, create a new listing with a title, price, category, condition, and description. The form validates required fields, then adds the listing to the top of the Home feed.
- **Profile** — View the logged-in user's avatar, name, email, join date, and bio, and log out.
- **Bottom Tab Navigation** — Quick access to Home, Sell an Item, Favorites, and Profile.

---

## Project Structure

```
src/
├── components/      # Reusable UI (ListingCard, SearchBar)
├── context/         # In-memory state (AuthContext, ListingsContext, FavoritesContext)
├── data/            # Seeded mock data (users.ts, listings.ts)
├── navigation/      # Navigators (RootNavigator, MainTabs, HomeStack, FavoritesStack)
├── screens/         # App screens (Login, Listings, ProductDetail, CreateListing, etc.)
└── types/           # Shared TypeScript types and category/condition constants
```

---

## Useful Scripts

```sh
npm start        # Start the Metro bundler
npm run ios      # Build & run on the iOS Simulator
npm run android  # Build & run on Android
npm run lint     # Run ESLint
npm test         # Run Jest tests
```

---

## Troubleshooting

- **Build / red error screen after first clone** — Make sure `npm install` and `bundle exec pod install` both completed, then restart Metro with a clean cache: `npm start -- --reset-cache`.
- **Stale bundle** — Press <kbd>R</kbd> in the iOS Simulator to reload, or stop and restart Metro.
- **CocoaPods errors** — Re-run `bundle install` then `bundle exec pod install --project-directory=ios`.
- For anything else, see the official [Troubleshooting](https://reactnative.dev/docs/troubleshooting) guide.
