import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import Modal from "@mui/material/Modal";
import SignupModal from "../registration/page";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSignupModal, setOpenSignupModal] = useState(false);

  const { data: users = [], error: fetchError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:1000/users");
      return response.data;
    },
    enabled: isOpen, // Fetch users only when the modal is open
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading || fetchError) {
      toast.error("Unable to process login. Please try again later.");
      return;
    }

    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      toast.success("Login successful!");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("profilePicture", user.profilePicture);

      onClose();
      setTimeout(() => {
        window.location.href = `/dashboard/${user.id}`;
      }, 1000);
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  const handleSignupClick = () => {
    onClose(); // Close the login modal
    setTimeout(() => setOpenSignupModal(true), 300); // Delay slightly for smooth transition
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
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
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-medium text-lg hover:bg-blue-700 transition"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              By logging in, you agree to our
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
              Don’t have an account?
              <span
                onClick={handleSignupClick}
                className="text-blue-600 hover:underline font-semibold ml-1 cursor-pointer"
              >
                Sign Up
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

      {openSignupModal && <SignupModal isOpen={openSignupModal} onClose={() => setOpenSignupModal(false)} />}
    </>
  );
}
