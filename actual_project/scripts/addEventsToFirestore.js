// Add all hardcoded events to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDC94zn7QamC6xJfCryC8OEUYRnFvBZHH8",
    authDomain: "eventfriend-2e489.firebaseapp.com",
    projectId: "eventfriend-2e489",
    storageBucket: "eventfriend-2e489.appspot.com",
    messagingSenderId: "53277412088",
    appId: "1:53277412088:web:4fbe8a96bf05ad295c890d",
    measurementId: "G-2B28Q3CZCW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hardcoded events (copy from user-home/page.tsx, simplified for Firestore)
const events = [
  {
    id: 1,
    title: "Gourmet Cooking Workshop",
    date: "Saturday, Dec 21, 2024 at 2:00 PM",
    location: "Atlanta, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 2,
    title: "New Year's Dance Party",
    date: "Tuesday, Dec 31, 2024 at 9:00 PM",
    location: "Savannah, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 3,
    title: "Spa & Wellness Retreat",
    date: "Sunday, Dec 22, 2024 at 10:00 AM",
    location: "Augusta, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 4,
    title: "Mathematics Workshop",
    date: "Friday, Dec 20, 2024 at 3:00 PM",
    location: "Athens, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 5,
    title: "Mountain Hiking Adventure",
    date: "Saturday, Dec 28, 2024 at 7:00 AM",
    location: "Helen, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 6,
    title: "Holiday Shopping Tour",
    date: "Saturday, Dec 21, 2024 at 11:00 AM",
    location: "Macon, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 7,
    title: "Community Volunteer Day",
    date: "Sunday, Dec 29, 2024 at 9:00 AM",
    location: "Columbus, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 8,
    title: "Live Music Concert",
    date: "Friday, Dec 27, 2024 at 7:00 PM",
    location: "Valdosta, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 9,
    title: "Dance Fitness Class",
    date: "Monday, Dec 23, 2024 at 6:00 PM",
    location: "Albany, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 10,
    title: "Business Presentation Workshop",
    date: "Wednesday, Dec 25, 2024 at 1:00 PM",
    location: "Warner Robins, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 11,
    title: "Farm-to-Table Experience",
    date: "Thursday, Dec 26, 2024 at 12:00 PM",
    location: "Marietta, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
  {
    id: 12,
    title: "Fashion Boutique Event",
    date: "Saturday, Dec 28, 2024 at 2:00 PM",
    location: "Roswell, Georgia",
    createdBy: "admin",
    peopleInterested: [],
  },
];

async function addEvents() {
  for (const event of events) {
    const ref = doc(collection(db, "events"), String(event.id));
    await setDoc(ref, event);
    console.log(`Added event: ${event.title}`);
  }
  console.log("All events added to Firestore.");
}

addEvents().catch(console.error); 