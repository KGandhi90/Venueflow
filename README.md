# 🏟️ VenueFlow

> Reimagining the physical event experience at large-scale sporting venues through real-time crowd intelligence, AI assistance, and seamless attendee coordination.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [App Walkthrough](#app-walkthrough)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [Roadmap](#roadmap)
- [Team](#team)

---

## Overview

VenueFlow is a full-stack progressive web application built for the **Horizon Arena** (50,000 seat stadium) that solves the core pain points of attending a live sporting event — long queues, crowd bottlenecks, poor wayfinding, and slow food service — by combining real-time crowd data, predictive wait time modeling, indoor navigation, and an AI-powered concierge.

The system has two distinct interfaces:

- **Attendee App** — a mobile-first PWA that fans use inside the stadium
- **Ops Dashboard** — a web interface for venue staff to monitor, coordinate, and respond in real time

---

## Problem Statement

Large-scale sporting venues hosting 40,000–80,000 attendees face a consistent set of challenges that degrade the fan experience:

- **Crowd bottlenecks** at entry gates and concourses cause dangerous congestion and long delays
- **Unpredictable wait times** at food courts, restrooms, and parking exits frustrate attendees
- **Poor wayfinding** — most fans navigate by guesswork, making congestion worse
- **Slow food and merchandise service** with no pre-ordering or seat delivery
- **Staff coordination gaps** — operations teams lack real-time visibility into crowd distribution
- **Reactive management** — problems are addressed after they escalate, not before

VenueFlow addresses every one of these directly.

---

## Solution

VenueFlow works across three layers:

**1. Real-Time Intelligence**
Live crowd density monitoring across all gates, concourses, food courts, and restroom blocks. Data updates every 8–15 seconds, giving both attendees and staff an accurate picture of the venue at any moment.

**2. Predictive Guidance**
An AI-driven suggestion engine that proactively tells attendees the best time to move — "best restroom break in ~8 minutes during stoppage time" — before queues form, rather than after.

**3. Seamless Service**
In-seat food and merchandise ordering with live order tracking, eliminating the need to queue at counters during the event.

---

## Features

### Attendee App

| Feature | Description |
|---|---|
| Live Venue Map | SVG stadium floor plan with real-time crowd density heatmap, gate wait times, and toggle overlays for restrooms, food courts, and exits |
| Smart Routing | Animated turn-by-turn path from current location to seat, with the lowest-congestion gate recommended dynamically |
| Wait Time Predictor | Live queue estimates for all gates, food courts, restroom blocks, and parking exits — with trend indicators (↑ ↓ →) |
| Pre-Order Hub | Browse and order food and merchandise by category, add to cart, choose seat delivery or counter pickup, and track order status live |
| AI Concierge | Claude-powered chat assistant for venue navigation, FAQs, lost items, accessibility needs, and real-time recommendations |
| Entry Guide | Gate recommendation based on seat section, live queue comparison across all gates, and QR ticket display |

### Ops Dashboard

| Feature | Description |
|---|---|
| Live Overview | Real-time stat cards for check-ins, average wait, active orders, and open support tickets |
| Crowd Flow Monitor | Staff-level venue map with zone crowd counts, gate open/close controls, and AI rebalancing suggestions |
| Order Management | Live order queue with status controls — mark orders as preparing, ready, or delivered |
| Staff Coordination | Roster view with zone assignments, duty status toggles, and broadcast messaging to all staff or specific zones |
| Alert Feed | Timestamped incident log with auto-alerts for congestion thresholds and low stock, with resolve functionality |

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS v3 | Utility-first styling |
| Lucide React | Icon library (strokeWidth 1.5 throughout) |
| Recharts | Charts on the ops dashboard |
| React Context API | Global state management |

### Backend *(Phase 4)*
| Tool | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Socket.io | Real-time event broadcasting |
| In-memory store | Order and state management (no DB required) |

### AI
| Tool | Purpose |
|---|---|
| Anthropic Claude API | AI concierge chat (claude-sonnet-4-20250514) |

### Infrastructure *(Phase 6)*
| Tool | Purpose |
|---|---|
| Vercel | Frontend hosting + CI/CD |
| Railway / Render | Backend hosting |

---

## Project Structure

```
venueflow/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons (192px, 512px)
│
├── src/
│   ├── pages/
│   │   ├── Home.jsx            # Attendee home — seat info, quick actions
│   │   ├── Map.jsx             # Live venue map with heatmap overlays
│   │   ├── WaitTimes.jsx       # Queue estimates for all facilities
│   │   ├── Orders.jsx          # Food & merch ordering with cart
│   │   ├── Chat.jsx            # AI concierge chat interface
│   │   ├── EntryGuide.jsx      # Gate recommendation + QR display
│   │   └── Dashboard.jsx       # Ops dashboard (light mode, sidebar layout)
│   │
│   ├── components/
│   │   ├── BottomNav.jsx       # Floating frosted-glass nav (attendee)
│   │   ├── TopBar.jsx          # Live match score bar
│   │   ├── VenueMap.jsx        # Reusable SVG stadium floor plan
│   │   ├── WaitCard.jsx        # Single wait time item card
│   │   ├── FoodItem.jsx        # Menu item card with add-to-cart
│   │   ├── ChatBubble.jsx      # Message bubble (user + AI variants)
│   │   ├── StatCard.jsx        # Dashboard metric card
│   │   ├── OrderTable.jsx      # Ops order management table
│   │   ├── AlertFeed.jsx       # Live incident alert list
│   │   └── StatusPill.jsx      # Reusable colored status badge
│   │
│   ├── context/
│   │   └── VenueContext.jsx    # Global state + live data simulation
│   │
│   ├── hooks/
│   │   ├── useLiveData.js      # setInterval-based live data nudging
│   │   └── useCart.js          # Cart state and actions
│   │
│   ├── api/
│   │   └── claudeApi.js        # Anthropic API wrapper with fallback
│   │
│   ├── data/
│   │   └── mockData.js         # All seed data for the app
│   │
│   ├── App.jsx                 # Router setup + layout wrappers
│   ├── main.jsx                # Entry point + VenueProvider wrapper
│   └── index.css               # Global styles, animations, design tokens
│
├── .env.example                # Environment variable template
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/venueflow.git
cd venueflow

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Add your Anthropic API key to .env

# Start the development server
npm run dev
```

The app runs at `http://localhost:5173`

The ops dashboard is at `http://localhost:5173/dashboard`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required for AI Concierge (Phase 3+)
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional — backend API URL (Phase 4+)
VITE_API_BASE_URL=http://localhost:3001
```

> If `VITE_ANTHROPIC_API_KEY` is not set, the chat screen falls back to keyword-based mock responses so the UI still works during development.

---

## App Walkthrough

### Attendee Flow

```
Pre-match                  During match              Post-match
─────────────────────────────────────────────────────────────────
Entry Guide           →   Home (live score)    →   Exit Routing
  └─ Gate recommend       Map (heatmap)             └─ Parking wait
  └─ QR ticket            WaitTimes (queues)
  └─ Parking status       Orders (food)
                          Chat (AI help)
```

**Home Screen**
The first thing an attendee sees is their seat info (Section F · Row 12 · Seat 34), the live match score in the top bar, a strip of real-time venue stats (38,247 inside · avg 5.4 min wait · 74% capacity), four quick-action cards, and a proactive AI suggestion card at the bottom.

**Map Screen**
An SVG overhead map of Horizon Arena with color-coded crowd density glows that update every 12 seconds. Toggle overlays show restroom, food, and exit markers. Tapping "Show Route" animates a dashed lime path from the nearest gate to your seat.

**Wait Times Screen**
Collapsible sections for restrooms, food courts, and parking. Each item shows the location name, a live wait time in minutes, a trend arrow, and a status pill. A "best time to visit" card at the bottom shows the lowest-wait option across all categories.

**Orders Screen**
Category tabs (Snacks, Mains, Drinks, Merchandise) with a sliding underline indicator. A 2-column item grid with a floating cart preview bar that slides up when the first item is added. The cart panel slides in from the right with quantity controls and a delivery toggle. Placing an order shows a confirmation toast and the order immediately appears in the ops dashboard.

**Chat Screen**
Seeded with a sample conversation. Typing or tapping a quick-reply chip sends a message, shows a staggered dot typing indicator for 1.2 seconds, then renders an AI response. In Phase 3+, responses come from the Claude API with full venue context in the system prompt.

**Entry Guide**
Dynamically recommends the gate with the lowest current wait time based on the attendee's seat section. Shows a comparison table of all six gates sorted by wait time, and a QR placeholder for ticket scanning.

### Ops Dashboard Flow

The dashboard opens to the Overview tab with four live stat cards, a real-time alert feed, and a condensed orders table. The sidebar has five sections:

- **Overview** — top-level numbers and alerts
- **Crowd Map** — same SVG map as attendee app, with zone crowd counts, staff location pins, gate control toggles, and an AI rebalancing suggestion
- **Orders** — full order queue with status controls
- **Staff** — roster table with duty status toggles per staff member
- **Alerts** — full incident log with resolve functionality and broadcast messaging

---

## API Reference

*(Phase 4 — backend endpoints)*

### Venue Status

```
GET /api/venue-status
Returns: { gates, waitTimes, dashStats, lastUpdated }
```

### Orders

```
GET  /api/orders
Returns: [ ...orderObjects ]

POST /api/orders
Body:    { seat, items, total, deliveryType }
Returns: { id, status: 'pending', ...orderObject }

PATCH /api/orders/:id
Body:    { status: 'preparing' | 'ready' | 'delivered' }
Returns: { ...updatedOrder }
```

### Chat (Claude proxy)

```
POST /api/chat
Body:    { message, conversationHistory }
Returns: { reply: string }
```

### Staff

```
GET   /api/staff
PATCH /api/staff/:id
Body: { status: 'on-duty' | 'break' }
```

### Alerts

```
GET   /api/alerts
PATCH /api/alerts/:id/resolve
POST  /api/alerts/broadcast
Body: { message, zone?: string }
```

---

## Design System

VenueFlow uses a custom dark-first design system. The attendee app has a near-black base with an electric lime accent; the ops dashboard flips to a warm off-white light mode with the same sidebar and accent color.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `base` | `#0A0A0F` | App background |
| `surface1` | `#111118` | Cards |
| `surface2` | `#1A1A24` | Elevated elements, inputs |
| `lime` | `#C8F135` | Primary CTA, live indicators, active states |
| `violet` | `#7C6AFA` | Secondary highlights, AI avatar |
| `muted` | `#6B6B7A` | Secondary text |
| `danger` | `#FF4D6D` | High crowd, errors |
| `warning` | `#FFB547` | Medium crowd, caution |
| `success` | `#00D68F` | Low crowd, resolved, on-duty |

Dashboard light mode uses `#F4F3EF` (warm off-white) as the background and `#1C1C27` for the sidebar.

### Typography

- **Display / numbers**: Syne (500, 600, 700) — used for match scores, seat numbers, wait times, and screen titles
- **Body / UI**: Inter (300, 400, 500, 600) — everything else
- Hierarchy is established through size contrast, not weight alone

### Animations

| Name | Duration | Usage |
|---|---|---|
| `fadeUp` | 0.25s | Page enter transition |
| `pulse-lime` | 1.8s loop | Live indicator dot |
| `flash` | 0.4s | Live number update feedback |
| `dash` | 1.2s | Map route stroke animation |
| `stagger` | 0.2s delay per dot | Chat typing indicator |

---

## Roadmap

### Completed
- [x] Phase 1 — UI Shell & Design System
- [x] Phase 2 — Frontend Logic & Interactivity

### In Progress
- [ ] Phase 3 — Claude AI Concierge integration
- [ ] Phase 4 — Node.js + Express backend API
- [ ] Phase 5 — Polish, micro-interactions, error & empty states
- [ ] Phase 6 — Deployment (Vercel + Railway)

### Future Ideas
- [ ] Real IoT sensor integration for actual crowd density data
- [ ] Push notifications for order-ready and gate alerts
- [ ] Loyalty points system for in-app purchases
- [ ] Multi-venue support with venue admin onboarding
- [ ] Wearable integration (Apple Watch haptics for seat navigation)
- [ ] Post-event analytics dashboard for venue operators
- [ ] Accessibility mode with larger text and high contrast

---

## Hackathon Context

**Problem Statement**: Design a solution that improves the physical event experience for attendees at large-scale sporting venues, addressing crowd movement, waiting times, and real-time coordination.

**Event**: Horizon Arena · City FC vs United FC · Matchday 22

**Key Demo Moments**:
1. Open the map — watch crowd density glows update live every 12 seconds
2. Ask the AI concierge "Where's the nearest restroom?" — get a real, context-aware answer
3. Place a food order — watch it appear instantly in the ops dashboard
4. Open the ops dashboard — see gate wait times change in real time
5. Mark an order as "Ready" in the dashboard — status updates in the attendee app
