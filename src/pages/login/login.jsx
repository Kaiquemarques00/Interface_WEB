import React, { useState } from "react";
import axios from "axios";

import Logo from '../../assets/logo2.png'
import "./login.style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [error, setError] = useState("");

  // Função que lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://api-pim.onrender.com/auth/login",
        {
          email,
          senha,
        }
      );

      // Armazena o token JWT no localStorage
      localStorage.setItem("token", response.data.token);
      console.log(response.data.token);

      // Redireciona o usuário para o dashboard
      window.location.href = "/home";
    } catch (error) {
      // Lidar com erros de requisição
      setError("Login falhou. Verifique suas credenciais.");
    }
  };

  return (
    <section className="login-container">
      <form onSubmit={handleSubmit} action="" className="login-form">
        <img src={Logo} className="login-img" alt="Logo da empresa" />
        <label className="login-label">Email:</label>
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="login-label">Senha:</label>
        <input
          type="password"
          className="login-input"
          value={senha}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button" onClick={handleSubmit}>
          Login
        </button>
        {error && <p style={{ color: "red" }} className="login-erro">{error}</p>}
      </form>
    </section>
  );
}

export default Login;
