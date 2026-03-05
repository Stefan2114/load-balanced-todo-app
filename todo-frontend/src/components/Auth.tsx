import React, { useState } from "react";
import api from "../api";

const Auth = ({ onLogin }: { onLogin: () => void }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const validate = () => {
    if (form.username.length < 2) return "Username must be at least 2 chars";
    if (form.password.length < 4) return "Password must be at least 4 chars";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      if (isRegister) {
        await api.post("/register", form);
        setIsRegister(false);
        setError("Registration successful! Please login.");
      } else {
        const res = await api.post("/login", form);
        localStorage.setItem("token", res.data.token);
        onLogin();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">
          {isRegister ? "Create Account" : "Sign In"}
        </button>
      </form>
      <p
        onClick={() => setIsRegister(!isRegister)}
        style={{ cursor: "pointer" }}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </p>
    </div>
  );
};

export default Auth;
