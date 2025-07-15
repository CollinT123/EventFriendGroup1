# Event Friend (Next.js)

## Dependencies

- [Next.js](https://nextjs.org/) – React framework for production
- [React](https://reactjs.org/) – JavaScript library for building user interfaces
- [Firebase](https://firebase.google.com/) – Backend platform for authentication, database, and storage
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework

## 🛠 Installation

### 1. Clone the Repository

- Clone this repository to your computer using GitHub Desktop or `git clone` in your terminal.

### 2. Install Dependencies

- Run `npm install` in the project root directory (`actual_project`).

### 3. Run the App

- Run `npm run dev` in the console.
- Your browser should open at http://localhost:3000

## 📁 Project Structure

```text
actual_project/
├── README.md                   # Project documentation
├── public/                     # Static public assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/                        # Application source code
│   ├── app/                    # Next.js app directory (routing/pages)
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── not-found.tsx       # 404 page
│   │   ├── globals.css         # Global styles (Tailwind)
│   │   ├── providers.tsx       # App-wide providers (React Query, Toaster, etc.)
│   │   ├── signup/             # Signup page
│   │   │   └── page.tsx
│   │   ├── user-home/          # User home/dashboard
│   │   │   └── page.tsx
│   │   ├── forgot-password/    # Password reset page
│   │   │   └── page.tsx
│   │   └── createProfile/      # Profile creation page
│   │       └── page.tsx
│   ├── components/             # React component modules
│   │   ├── FileUpload.tsx      # File upload component
│   │   └── ui/                 # UI component library (buttons, forms, etc.)
│   ├── firebase/               # Firebase configuration
│   │   └── firebaseConfig.js
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   └── lib/                    # Utility functions
│       └── utils.ts
├── package.json                # Project metadata and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── next.config.js              # Next.js configuration
```

## Notes

- This project uses Next.js App Router and React Server Components where possible.
- All Firebase operations (auth, Firestore, storage) are handled client-side using the Firebase JS SDK.
- UI is built with reusable components and Tailwind CSS for rapid development and consistency.

---

For more details, see the `ARCHITECTURE.txt` file in this project.
