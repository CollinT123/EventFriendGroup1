"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage} from "@/firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default function Index() {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log("Starting form submission...");
      
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCred.user.uid;
      console.log("User created with UID:", uid);

      await setDoc(doc(db, "users", uid), {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        createdAt: new Date().toISOString()
      });
      console.log("User document created in Firestore");

      alert("Account created successfully!");
      router.push("/"); // Redirect to sign in (home) page
    } catch (err: any) {
      console.error("Error during signup:", err);
      
      let errorMessage = "Failed to create account: ";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage += "Email is already registered";
      } else if (err.code === 'auth/weak-password') {
        errorMessage += "Password is too weak";
      } else if (err.code === 'storage/unauthorized') {
        errorMessage += "Storage access denied. Please check Firebase Storage rules";
      } else if (err.code === 'storage/quota-exceeded') {
        errorMessage += "Storage quota exceeded";
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
    }
  };

  return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2">
              Ready to become an...
            </h1>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
              Event Friend!
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <div className="border-4 border-black bg-white">
                <input type="text" placeholder="Name:" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full px-4 py-4 text-black font-medium placeholder-black bg-transparent focus:outline-none text-lg" />
              </div>
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* DOB */}
            <div>
              <div className="border-4 border-black bg-white flex items-center">
                <span className="text-black font-medium text-lg px-4 py-4">Date of Birth:</span>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} className="flex-1 py-4 pr-4 text-black font-medium bg-transparent focus:outline-none text-lg" />
              </div>
              {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
            </div>

            {/* Profile Picture */}

            {/* Email */}
            <div>
              <div className="border-4 border-black bg-white">
                <input type="email" placeholder="Email:" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full px-4 py-4 text-black font-medium placeholder-black bg-transparent focus:outline-none text-lg" />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="border-4 border-black bg-white">
                <input type="password" placeholder="Password:" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className="w-full px-4 py-4 text-black font-medium placeholder-black bg-transparent focus:outline-none text-lg" />
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="border-4 border-black bg-white">
                <input type="password" placeholder="Confirm Password:" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} className="w-full px-4 py-4 text-black font-medium placeholder-black bg-transparent focus:outline-none text-lg" />
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex justify-center pt-8">
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-black font-bold px-12 py-4 text-xl transition-colors duration-200">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}