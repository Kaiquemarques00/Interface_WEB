import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Appbar from "../../components/appbar/appbar.jsx";
import api from "../../service/api.js";


const AlertModal = ({ show, message, onCancel, list }) => {
    if (!show) return null;
    const [cultura, setCultura] = useState("");
    const [area_plantada, setArea] = useState("");
    const [status, setStatus] = useState("");
    const [insumo, setInsumo] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [messageAPI, setMessage] = useState("");
    const [errorAPI, setError] = useState("");

    const handleChange = (e) => {
        const area_plantada = e.target.value;
        
        const parsedValue = parseFloat(area_plantada) || 0; // Converte para inteiro ou usa 0 como fallback
        setArea(parsedValue);
        console.log(typeof parsedValue);
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      
      try {
        const response = await api.post(
          "/planting",
          {
            cultura,
            area_plantada,
            status,
            insumo,
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
            <label htmlFor="cultura">Cultura: </label>
            <select value={cultura} onChange={(e) => setCultura(e.target.value)}>
                <option value="" disabled>Selecione...</option>
                {list.map((option, index) => (
                    <option key={index} value={option.nome}>
                    {option.nome}
                  </option>
                ))}
          </select>
            <label htmlFor="area_plantada">Área plantada: </label>
            <input
              type="number"
              value={area_plantada}
              onChange={handleChange}
              required
            />
            <label htmlFor="lista_insumos">Principal insumo: </label>
            <input
              type="text"
              value={insumo}
              onChange={(e) => setInsumo(e.target.value)}
              required
            />
            <label htmlFor="status">Status: </label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="" disabled>Selecione...</option>
                <option value="planejado" >Planejado</option>
                <option value="em andamento" >Em andamento...</option>
                <option value="concluido" >Concluido</option>
                <option value="cancelado" >Cancelado</option>
          </select>
            <label htmlFor="observacoes">Observações: </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
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

const Plantios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [culturasAPI, setCulturasAPI] = useState("");

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/plantings", {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
          },
        });

        const  responseCulture = await api.get("/cultures", {
            headers: {
              Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
            },
          });

        setData(response.data); // Armazenando os dados protegidos na state
        setCulturasAPI(responseCulture.data)
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

  const [plantioSelecionado, setPlantioSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal e definir o usuário selecionado
  const abrirModal = (plantio) => {
    setPlantioSelecionado(plantio);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setPlantioSelecionado(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Appbar />
      <main>
        <Sidebar />
        <section className="main-container">
        <h2>Tabela de Plantios</h2>
        <article className="create-user">
            <AlertModal
                  show={showModal}
                  message="Cria Plantio"
                  onCancel={cancelModal}
                  list={culturasAPI}
              />
            <button onClick={openModal} className="cria-user">Criar Plantio</button>
          </article>
          <article className="tabela-container">
            {data ? (
                <table className="tabela">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Área plantada</th>
                    <th>Cultura</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((plantio) => (
                    <tr key={plantio.plantio_id} onClick={() => abrirModal(plantio)}>
                      <td>{plantio.plantio_id}</td>
                      <td>{plantio.area_plantada}</td>
                      <td>{plantio.cultura_nome}</td>
                      <td>{plantio.status}</td>
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
                <h3>Detalhes do Plantio</h3>
                <div className="infos">
                  <p><strong>ID:</strong> {plantioSelecionado.plantio_id}</p>
                  <p><strong>Área plantada:</strong> {plantioSelecionado.area_plantada}</p>
                  <p><strong>Cultura:</strong> {plantioSelecionado.cultura_nome}</p>
                  <p><strong>Inicio colheita:</strong> {plantioSelecionado.data_inicio}</p>
                  <p><strong>Previsão colheita:</strong> {plantioSelecionado.previsao_colheita}</p>
                  <p><strong>Status:</strong> {plantioSelecionado.status}</p>
                  <p><strong>Observações:</strong> {plantioSelecionado.observacoes}</p>
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

export default Plantios;
