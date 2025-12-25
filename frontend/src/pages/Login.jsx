import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) return alert("Fill all fields");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/notes");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-box">
      <h2>Welcome Back 👋</h2>
      <p className="sub">Login to your notes</p>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />

      <button className="primary-btn" onClick={login}>Login</button>

      <span className="link" onClick={() => navigate("/register")}>
        New user? Register
      </span>
    </div>
  );
}

export default Login;
