# Event Friend - Social Event Matching App

A modern social networking application that helps users discover events and connect with like-minded people. Built with Next.js, Firebase, and Tailwind CSS.

## 🚀 Features

### **Authentication & User Management**

- **User Registration & Login** - Secure authentication with Firebase Auth
- **Password Reset** - Forgot password functionality
- **Profile Creation** - Customizable user profiles with image upload
- **Profile Management** - Edit personal information and preferences

### **Event Discovery & Matching**

- **Event Feed** - Browse curated events with detailed information
- **Interest Expression** - Show interest in other users for specific events
- **Smart Matching** - Automatic matching when two users express mutual interest
- **Event Filtering** - Filter events by category/theme

### **Social Features**

- **Real-time Chat** - Direct messaging with matched users
- **Match Management** - View all your matches with event details
- **Unmatch Functionality** - Remove matches and prevent future matching
- **Profile Viewing** - View detailed profiles of other users

### **User Experience**

- **Responsive Design** - Works seamlessly on desktop and mobile
- **Modern UI** - Clean, intuitive interface with smooth animations
- **Real-time Updates** - Live updates for matches and messages
- **Image Upload** - Profile picture upload with ImageKit integration

## 🛠 Tech Stack

- **[Next.js 14](https://nextjs.org/)** – React framework with App Router
- **[React 18](https://reactjs.org/)** – UI library with hooks
- **[Firebase](https://firebase.google.com/)** – Authentication, Firestore database, and real-time features
- **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** – Modern component library
- **[ImageKit](https://imagekit.io/)** – Image upload and optimization
- **[TypeScript](https://www.typescriptlang.org/)** – Type-safe JavaScript

## 📁 Project Structure

```text
actual_project/
├── README.md                   # Project documentation
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing/login page
│   │   ├── not-found.tsx       # 404 page
│   │   ├── globals.css         # Global styles
│   │   ├── providers.tsx       # App providers (Toaster, etc.)
│   │   ├── signup/             # User registration
│   │   │   └── page.tsx
│   │   ├── forgot-password/    # Password reset
│   │   │   └── page.tsx
│   │   ├── user-home/          # Main user interface
│   │   │   ├── page.tsx        # Event discovery
│   │   │   ├── dashboard/      # Matches and profile management
│   │   │   │   └── page.tsx
│   │   │   ├── chat/           # Real-time messaging
│   │   │   │   └── page.tsx
│   │   │   └── create-profile/ # Profile setup
│   │   │       └── page.tsx
│   │   └── api/                # API routes
│   │       └── imagekit-auth/  # ImageKit authentication
│   │           └── route.ts
│   ├── components/             # React components
│   │   ├── FileUpload.tsx      # File upload component
│   │   └── ui/                 # UI component library
│   │       ├── button.tsx      # Button components
│   │       ├── dialog.tsx      # Modal dialogs
│   │       ├── input.tsx       # Form inputs
│   │       ├── avatar.tsx      # Avatar components
│   │       ├── card.tsx        # Card layouts
│   │       ├── badge.tsx       # Badge components
│   │       ├── slider.tsx      # Range sliders
│   │       ├── textarea.tsx    # Text areas
│   │       ├── label.tsx       # Form labels
│   │       ├── toast.tsx       # Toast notifications
│   │       ├── toaster.tsx     # Toast container
│   │       ├── sonner.tsx      # Alternative toast
│   │       ├── tooltip.tsx     # Tooltip components
│   │       ├── animated-eye.tsx # Animated eye component
│   │       └── use-toast.ts    # Toast utilities
│   ├── firebase/               # Firebase configuration
│   │   └── firebaseConfig.js   # Firebase setup
│   ├── imagekit/               # ImageKit integration
│   │   └── imagekit-auth.ts    # ImageKit auth
│   ├── hooks/                  # Custom React hooks
│   │   └── use-toast.ts        # Toast hook
│   └── lib/                    # Utilities
│       └── utils.ts            # Helper functions
├── scripts/                    # Database scripts
│   └── addEventsToFirestore.js # Event population script
├── firestore.rules             # Firestore security rules
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
├── next.config.js              # Next.js config
└── components.json             # Shadcn/ui config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- ImageKit account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd actual_project
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Set up Firebase**

   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update `src/firebase/firebaseConfig.js` with your Firebase config
   - Deploy Firestore security rules from `firestore.rules`
4. **Set up ImageKit** (optional, for image uploads)

   - Create an ImageKit account
   - Update the ImageKit configuration in the code
5. **Populate the database**

   ```bash
   node scripts/addEventsToFirestore.js
   ```
6. **Run the development server**

   ```bash
   npm run dev
   ```
7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Key Features Implementation

#### **Authentication Flow**

- Firebase Authentication for user registration and login
- Protected routes and user state management
- Password reset functionality

#### **Event System**

- Curated event database with detailed information
- Event filtering by category/theme
- Interest expression and matching algorithm

#### **Matching System**

- Bidirectional interest tracking
- Automatic match creation when mutual interest is detected
- Match management with unmatch functionality

#### **Real-time Chat**

- Firebase Firestore for real-time messaging
- User-friendly chat interface
- Message history and timestamps

#### **Profile Management**

- Comprehensive user profiles with images
- Event preference selection
- Profile editing capabilities

### Database Schema

#### **Collections:**

- `users` - User profiles and preferences
- `events` - Event information and metadata
- `interests` - User interest expressions
- `matches` - Successful matches between users
- `messages` - Chat messages between matched users

### Security Rules

- Comprehensive Firestore security rules
- User-based access control
- Data validation and protection

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Modern Components** - Shadcn/ui component library
- **Smooth Animations** - Enhanced user experience
- **Accessibility** - WCAG compliant components
- **Dark/Light Mode Ready** - Theme support infrastructure

## 📝 Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update the values in `.env.local` with your own API keys:**

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

   # ImageKit Configuration
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key_here
   NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint_here
   ```

   **Note:** The `.env.local` file is already in `.gitignore` and will not be committed to the repository.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js, Firebase, and Tailwind CSS**
