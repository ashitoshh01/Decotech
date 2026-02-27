# AgriTrade — Next.js 15 + Firebase + TailwindCSS

A production-ready digital agricultural marketplace inspired by the Government of India's AgriTrade portal.

## 🚀 Quick Start
```bash
cd enam-app
npm install
npm run dev        # Development server at localhost:3000
npm run build      # Production build
npm run start      # Production server
```

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx            ← Landing/Hero + Testimonials + MSP Table
│   ├── login/page.tsx      ← Phone OTP + Keypad + Google Sign-in
│   ├── register/page.tsx   ← Farmer/Trader registration
│   ├── marketplace/        ← Search Surplus, Post Surplus, Listings
│   ├── trade/[id]/         ← Chat Interface + Confirm Trade + Escrow
│   ├── dashboard/          ← Wallet, Transactions, Analytics
│   ├── prices/             ← Live MSP prices + AC conversion
│   ├── about/              ← Full AgriCredit system explainer
│   └── chat/[id]/          ← Chat redirect
├── components/
│   ├── Navbar.tsx           ← Responsive nav with auth state
│   └── Chatbot.tsx          ← AgriBot domain-aware chatbot
├── context/
│   ├── AuthContext.tsx      ← Firebase Phone Auth provider
│   └── ChatContext.tsx      ← Chatbot state & responses
└── lib/
    ├── firebase.ts          ← Firebase initialization
    ├── agriCredit.ts        ← MSP pegging, rewards, escrow math
    └── marketplace.ts       ← Firestore CRUD + atomic transactions
```

## 🌾 AgriCredit System

**Peg:** 1 AC = ₹22.75 (Wheat MSP 2024-25 per kg)

| Action                  | Reward    |
|-------------------------|-----------|
| Post listing            | +5 AC     |
| Complete trade (seller) | +10 AC    |
| First trade/month       | +25 AC    |
| Verify farmer           | +15 AC    |
| Grade A produce         | +20 AC    |
| Refer new farmer        | +50 AC    |

**Platform Fee:** 1% deducted on each trade  
**Escrow:** Buyer's ACs locked at bid → released after delivery confirmation  
**Decay:** Credits inactive 12+ months → 2%/month decay (anti-hoarding)

## 🔥 Firebase Configuration

In `.env.local` (already set up):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
...
```

> ⚠️ For Firebase Phone Auth billing:
> Enable Phone Authentication in Firebase Console → Authentication → Sign-in providers.
> Requires Blaze (pay-as-you-go) plan.

## 📱 KaiOS / Feature Phone Support

- All buttons have `min-height: 44px` (touch-friendly)
- OTP keypad designed like a physical phone keypad
- Base font size 16px for readability
- Minimal JavaScript, fast initial load (< 200KB CSS)
- No complex WebGL or heavy animations on entry

## 🗺️ Pages

| Route          | Description                              |
|----------------|------------------------------------------|
| `/`            | Landing page with hero, testimonials      |
| `/login`       | Phone OTP + Google Sign-in               |
| `/register`    | Farmer/Trader registration flow           |
| `/marketplace` | Browse & post surplus crops              |
| `/trade/[id]`  | Chat → Confirm → Escrow → Complete       |
| `/dashboard`   | Wallet, analytics, rewards               |
| `/prices`      | Live MSP + AgriCredit conversions        |
| `/about`       | Full AgriCredit system documentation     |

## 🚀 Deploy to Vercel

```bash
vercel --prod
```

Set environment variables in Vercel dashboard matching `.env.local`.
