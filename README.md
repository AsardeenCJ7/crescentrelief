# Crescent Relief 🌙

**An Islamic charity crowdfunding platform** built with React, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
crescentrelief/
├── client/                  ← Frontend (React + Vite + Tailwind CSS)
│   ├── public/
│   │   └── images/          ← Static images (hero, campaigns, etc.)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── assets/          ← SVG / raster assets
│   │   ├── components/
│   │   │   ├── auth/        ← Login & Register modals
│   │   │   ├── campaign/    ← CampaignCard, DonationWidget, CampaignVideo
│   │   │   ├── common/      ← Badge, Button, ProgressBar, Skeleton, etc.
│   │   │   ├── hero/        ← HeroSection
│   │   │   ├── layout/      ← Navbar, Footer, AdminLayout, PublicLayout
│   │   │   ├── sections/    ← Home page sections (Testimonials, FAQ, etc.)
│   │   │   └── ui/          ← FloatingAssistant
│   │   ├── constants/
│   │   │   └── data.js      ← Mock/seed data for campaigns, testimonials, etc.
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── index.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CampaignsPage.jsx
│   │   │   ├── CampaignDetailPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ImpactPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── TermsPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── admin/       ← Admin panel pages
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── services/
│   │   │   └── api.js       ← Axios API service layer
│   │   └── utils/
│   │       └── formatters.js
│   ├── .env                 ← VITE_API_URL, VITE_GOOGLE_CLIENT_ID
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                  ← Backend (Node.js + Express + MongoDB)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── campaignController.js
│   │   ├── donationController.js
│   │   ├── miscController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js          ← JWT protect, adminOnly, optionalAuth
│   │   ├── errorHandler.js
│   │   └── upload.js        ← Multer file upload
│   ├── models/
│   │   ├── AuditLog.js
│   │   ├── Campaign.js
│   │   ├── Contact.js
│   │   ├── Donation.js
│   │   ├── Favourite.js
│   │   ├── Subscriber.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── campaignRoutes.js
│   │   ├── donationRoutes.js
│   │   ├── miscRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/
│   │   └── seed.js          ← Database seeder
│   ├── uploads/             ← Uploaded media files
│   ├── utils/
│   │   └── sendEmail.js     ← Nodemailer email service
│   ├── config/              ← DB config
│   ├── index.js             ← Express app entry point
│   ├── package.json
│   └── .env                 ← MongoDB URI, JWT secret, email config
│
├── .gitignore
├── package.json             ← Root monorepo scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 2. Set Up Environment Variables

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Server** (`server/.env`):
```
MONGO_URI=mongodb://localhost:27017/crescentrelief
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
```

### 3. Seed the Database

```bash
cd server && npm run seed
```

### 4. Run Development Servers

**Client** (port 5173):
```bash
cd client && npm run dev
```

**Server** (port 5000):
```bash
cd server && npm run dev
```

---

## 🔑 Key Features

- 🌙 Islamic charity crowdfunding platform
- 🔐 Google OAuth + email/OTP authentication
- 🎖️ Referral system with badge progression (Bronze → Diamond)
- 📊 Real-time campaign stats and donation tracking
- 📱 Fully mobile-responsive design
- 🌙 Dark mode support
- 🔗 Social sharing with unique referral links
- 📧 Automated email notifications via Nodemailer

---

## 🛠️ Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Backend  | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth     | JWT, Google OAuth 2.0 |
| Email    | Nodemailer |
| UI Icons | Material Symbols, Lucide React, React Icons |
