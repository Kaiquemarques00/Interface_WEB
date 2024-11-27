import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Appbar from "../../components/appbar/appbar.jsx";
import api from "../../service/api.js";

import "./usuarios.style.css";

const AlertModal = ({ show, message, onCancel }) => {
  if (!show) return null;
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [messageAPI, setMessage] = useState("");
  const [errorAPI, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await api.post(
        "/user",
        {
          nome,
          email,
          senha,
          role
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
          }
        }
      );

      console.log(role);
      setMessage(response.data);
      setInterval(location.reload(), 2000);
    } catch (error) {
      // Lidar com erros de envio de dados
      setError(error.response.data);
      console.log(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{message}</h2>
        <form onSubmit={handleSubmit} className="inputs">
          <label htmlFor="nome">Nome: </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="senha">Senha: </label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="role">Tipo usuário: </label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="" disabled>Selecione...</option>
            <option value="administrador">Administrador</option>
            <option value="funcionario">Funcionario</option>
          </select>
          {messageAPI ? (
            <p>{messageAPI}</p>
          ) : (
            <p>{errorAPI}</p>
          )}
        </form>
        <div className="modal-actions">
          <button className="confirm-button" type="submit" onClick={handleSubmit}>Criar</button>
          <button className="cancel-button" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const Usuarios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
          },
        });

        setData(response.data); // Armazenando os dados protegidos na state
      } catch (error) {
        setError("Erro ao carregar dados protegidos.");
      }
    };

    fetchProtectedData();
  }, []);

  // Decodificar o token JWT para obter informações do usuário (opcional)

  console.log(data);

  const openModal = () => {
    setShowModal(true);
  }; 
  
  const cancelModal = () => {
    setShowModal(false); // Esconde o modal
  };

  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal e definir o usuário selecionado
  const abrirModal = (usuario) => {
    setUsuarioSelecionado(usuario);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setUsuarioSelecionado(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Appbar />
      <main>
        <Sidebar />
        <section className="main-container">
        <h2>Tabela de Usuários</h2>
        <article className="create-user">
            <AlertModal
                  show={showModal}
                  message="Cria usuario"
                  onCancel={cancelModal}
              />
            <button onClick={openModal} className="cria-user">Criar Usuário</button>
          </article>
          <article className="tabela-container">
            {data ? (
                <table className="tabela">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Tipo Usuário</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((usuario) => (
                    <tr key={usuario.usuario_id} onClick={() => abrirModal(usuario)}>
                      <td>{usuario.usuario_id}</td>
                      <td>{usuario.nome}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.tipo_usuario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Carregando dados...</p>
            )
          }
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Detalhes do Usuário</h3>
                <div className="infos">
                  <p><strong>ID:</strong> {usuarioSelecionado.usuario_id}</p>
                  <p><strong>Nome:</strong> {usuarioSelecionado.nome}</p>
                  <p><strong>E-mail:</strong> {usuarioSelecionado.email}</p>
                  <p><strong>Tipo Usuário:</strong> {usuarioSelecionado.tipo_usuario}</p>
                  <p><strong>Data Criação:</strong> {usuarioSelecionado.data_criacao}</p>
                </div>
                <button onClick={fecharModal} className="cancel-button">Fechar</button>
              </div>
            </div>
          )}
          </article>
        </section>
      </main>
    </>
  );
};

export default Usuarios;
