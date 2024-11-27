import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Appbar from "../../components/appbar/appbar.jsx";
import api from "../../service/api.js";

import "./culturas.style.css";

const AlertModal = ({ show, message, onCancel }) => {
    if (!show) return null;
    const [nome, setNome] = useState("");
    const [ciclo, setCiclo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [messageAPI, setMessage] = useState("");
    const [errorAPI, setError] = useState("");

    const handleChange = (e) => {
        const cicloInput = e.target.value;
        
        const parsedValue = parseInt(cicloInput) || 0; // Converte para inteiro ou usa 0 como fallback
        setCiclo(parsedValue);
        console.log(typeof parsedValue);
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
        console.log(typeof ciclo);
      try {
        const response = await api.post(
          "/culture",
          {
            nome,
            ciclo,
            descricao
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
            }
          }
        );
  
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
            <label htmlFor="ciclo">Ciclo em dias: </label>
            <input
              type="number"
              value={ciclo}
              onChange={handleChange}
              required
            />
            <label htmlFor="descricao">Descrição: </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
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
        const response = await api.get("/cultures", {
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

  const [culturaSelecionada, setCulturaSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal e definir o usuário selecionado
  const abrirModal = (usuario) => {
    setCulturaSelecionada(usuario);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setCulturaSelecionada(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Appbar />
      <main>
        <Sidebar />
        <section className="main-container">
        <h2>Tabela de Culturas</h2>
        <article className="create-user">
            <AlertModal
                  show={showModal}
                  message="Cria Cultura"
                  onCancel={cancelModal}
              />
            <button onClick={openModal} className="cria-user">Criar Cultura</button>
          </article>
          <article className="tabela-container">
            {data ? (
                <table className="tabela cultura">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ciclo em dias</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((cultura) => (
                    <tr key={cultura.cultura_id} onClick={() => abrirModal(cultura)}>
                      <td>{cultura.cultura_id}</td>
                      <td>{cultura.ciclo_cultivo_dias}</td>
                      <td>{cultura.nome}</td>
                      <td>{cultura.descricao}</td>
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
                <h3>Detalhes da Cultura</h3>
                <div className="infos">
                  <p><strong>ID:</strong> {culturaSelecionada.cultura_id}</p>
                  <p><strong>Nome:</strong> {culturaSelecionada.nome}</p>
                  <p><strong>Ciclo em dias:</strong> {culturaSelecionada.ciclo_cultivo_dias}</p>
                  <p><strong>Descrição:</strong> {culturaSelecionada.descricao}</p>
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
