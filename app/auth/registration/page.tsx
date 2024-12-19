import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Modal from "@mui/material/Modal";
import LoginModal from "../login/page";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

export default function SignupModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await axios.post("http://localhost:1000/users", newUser);
      return response.data;
    },
    onSuccess: () => {
      toast.success("User registered successfully!");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        `Error: ${
          error?.response?.data?.message || "An unknown error occurred"
        }`
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, email, password, mobileNumber, profilePicture });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginClick = () => {
    onClose(); // Close the signup modal
    setTimeout(() => setOpenLoginModal(true), 300); // Delay slightly for smooth transition
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Sign Up
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile Number
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="block w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full p-3 text-gray-700 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Profile Picture
                </label>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {profilePicture && (
                  <img
                    src={profilePicture}
                    alt="Preview"
                    className="mt-2 mx-auto w-20 h-20 object-cover rounded-full border"
                  />
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-medium text-lg hover:bg-blue-700 transition"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Registering..." : "Sign Up"}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              By signing up, you agree to our
              <Link href="/terms" className="text-blue-500 hover:underline mx-1">
                Terms and Conditions
              </Link>
              and
              <Link href="/privacy" className="text-blue-500 hover:underline mx-1">
                Privacy Policy
              </Link>
              .
            </p>

            <p className="text-sm text-gray-800 text-center mt-6">
              Already have an account?
              <span
                onClick={handleLoginClick}
                className="text-blue-600 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Log In
              </span>
            </p>

            <button
              onClick={onClose}
              className="mt-4 text-gray-500 hover:text-black text-sm block mx-auto transition"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {openLoginModal && <LoginModal isOpen={openLoginModal} onClose={() => setOpenLoginModal(false)} />}
    </>
  );
}
