import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Appbar from "../../components/appbar/appbar.jsx";
import api from "../../service/api.js";


const AlertModal = ({ show, message, onCancel, list }) => {
    if (!show) return null;
    const [plantio_id, setPlantio] = useState("");
    const [qtd_colhida, setColhida] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [messageAPI, setMessage] = useState("");
    const [errorAPI, setError] = useState("");

    const handleChangePlantio = (e) => {
        const plantio_id = e.target.value;
        const plantioConvert = parseInt(plantio_id) || 0; // Converte para inteiro ou usa 0 como fallback
        setPlantio(plantioConvert);
      };

    const handleChangeQuantidade = (e) => {
        const qtd_colhida = e.target.value
        const quantidadeConvert = parseFloat(qtd_colhida) || 0;
        setColhida(quantidadeConvert)
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      
      try {
        const response = await api.post(
          "/harvest",
          {
            plantio_id,
            qtd_colhida,
            observacoes
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
            <label htmlFor="plantio_id">Plantio ID: </label>
            <select value={plantio_id} onChange={handleChangePlantio}>
                <option value="" disabled>Selecione...</option>
                {list.map((option, index) => (
                    <option key={index} value={option.plantio_id}>
                    {option.plantio_id}
                  </option>
                ))}
          </select>
            <label htmlFor="qtd_colhida">Quantidade colhida: </label>
            <input
              type="number"
              value={qtd_colhida}
              onChange={handleChangeQuantidade}
              required
            />
            <label htmlFor="observacoes">Observações: </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => {setObservacoes(e.target.value)}}
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

const Colheitas = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [culturasAPI, setCulturasAPI] = useState("");

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/harvests", {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
          },
        });

        const  responsePlantio = await api.get("/plantings", {
            headers: {
              Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
            },
          });

        setData(response.data); // Armazenando os dados protegidos na state
        setCulturasAPI(responsePlantio.data)
      } catch (error) {
        setError("Erro ao carregar dados protegidos.");
      }
    };

    fetchProtectedData();
  }, []);

  // Decodificar o token JWT para obter informações do usuário (opcional)

  const openModal = () => {
    setShowModal(true);
  }; 
  
  const cancelModal = () => {
    setShowModal(false); // Esconde o modal
  };

  const [colheitaSelecionada, setColheitaSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal e definir o usuário selecionado
  const abrirModal = (colheita) => {
    setColheitaSelecionada(colheita);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setColheitaSelecionada(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Appbar />
      <main>
        <Sidebar />
        <section className="main-container">
        <h2>Tabela de Colheita</h2>
        <article className="create-user">
            <AlertModal
                  show={showModal}
                  message="Cria Plantio"
                  onCancel={cancelModal}
                  list={culturasAPI}
              />
            <button onClick={openModal} className="cria-user">Criar Colheita</button>
          </article>
          <article className="tabela-container">
            {data ? (
                <table className="tabela">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Quantidade</th>
                    <th>Plantio</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((colheita) => (
                    <tr key={colheita.colheita_id} onClick={() => abrirModal(colheita)}>
                      <td>{colheita.colheita_id}</td>
                      <td>{colheita.data_colheita}</td>
                      <td>{colheita.quantidade_colhida}</td>
                      <td>{colheita.plantio_id}</td>
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
                <h3>Detalhes da Colheita</h3>
                <div className="infos">
                  <p><strong>ID:</strong> {colheitaSelecionada.colheita_id}</p>
                  <p><strong>Data:</strong> {colheitaSelecionada.data_colheita}</p>
                  <p><strong>Quantidade:</strong> {colheitaSelecionada.quantidade_colhida}</p>
                  <p><strong>Plantio:</strong> {colheitaSelecionada.plantio_id}</p>
                  <p><strong>Observações:</strong> {colheitaSelecionada.observacoes}</p>
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

export default Colheitas;
