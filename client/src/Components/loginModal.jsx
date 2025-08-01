import React, { useState, useEffect } from "react";
import { Button } from "./Layout/Button";
import { Input } from "./Layout/Input";
import { Dropdown } from "./Layout/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { signup, login } from "../slice/authSlice";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const LoginModal = ({ onClose, onSwitch, label }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const { login: contextLogin } = useAuth();
  const navigate = useNavigate();
   const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (form.password !== form.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      dispatch(signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
      }));
    } else {
      dispatch(login({
        email: form.email,
        password: form.password,
      })).then((action) => {
        if (action.type === "auth/login/fulfilled") {
          const { user, token } = action.payload;
          contextLogin(user, token);
          // Redirect based on role
          console.log(user.role, label)
          if (user.role === "hall-owner") navigate(`/${user.id}`);
          else if (user.role === "admin") navigate(`/${user.id}`);
          else if (user.role === "manager") navigate(`/${user.id}`);
          else if(user.role ==="agency") navigate("/agency")
          else if(user.role ==='user' && label==='hall') navigate("/hall");
          else if(user.role==='user' && label==='matches') navigate('/home')
          else navigate("/");
          onClose && onClose();
        }
      });
    }
  };

  useEffect(() => {
    if (success && isSignUp) {
      setIsSignUp(false);
    }
  }, [success, isSignUp]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative border-2 border-marriagePink">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-marriageRed text-2xl font-bold hover:text-marriageHotPink"
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="text-2xl font-extrabold text-marriageRed mb-2 text-center font-serif">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-marriageHotPink mb-6 font-mono">
          {isSignUp ? "Sign up to find your perfect match" : "Login to your account"}
        </p>
        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <Dropdown
                name="role"
                value={form.role}
                onChange={handleChange}
                options={[
                  { value: "user", label: "User" },
                  { value: "hall-owner", label: "Hall Owner" },
                  { value: "manager", label: "Manager" },
                  { value: "agency", label: "Agency" },

                ]}
                required
              />
            </>
          )}
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {isSignUp && (
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          {error && (
            <div className="text-marriageRed text-sm text-center">{error}</div>
          )}
          {success && isSignUp && (
            <div className="text-green-600 text-sm text-center">Signup successful!</div>
          )}
          {success && !isSignUp && (
            <div className="text-green-600 text-sm text-center">Login successful!</div>
          )}
          <Button
            btnText={loading ? (isSignUp ? "Signing Up..." : "Logging In...") : isSignUp ? "Sign Up" : "Login"}
            btnColor="marriageHotPink"
            padding="w-full py-3"
            type="submit"
            disabled={loading}
          />
        </form>
        {/* Switch Mode */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                className="text-marriageHotPink font-semibold hover:underline"
                onClick={() => setIsSignUp(false)}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                className="text-marriageHotPink font-semibold hover:underline"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 