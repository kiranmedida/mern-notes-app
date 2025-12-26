import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    if (!name || !email || !password) return alert("Fill all fields");

    try {
      await axios.post(
        "https://mern-notes-app-6t9w.onrender.com/api/auth/register",
        { name, email, password }
      );
      alert("Registration successful");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-box">
      <h2>Create Account ✨</h2>
      <p className="sub">Start writing notes</p>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary-btn" onClick={register}>Register</button>

      <span className="link" onClick={() => navigate("/")}>
        Already have an account? Login
      </span>
    </div>
  );
}

export default Register;
