import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Appbar from "../../components/appbar/appbar.jsx";
import api from "../../service/api.js";


const AlertModal = ({ show, message, onCancel, list }) => {
    if (!show) return null;
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("");
    const [medida, setMedida] = useState("");
    const [qtd_estoque, setQuantidade] = useState("");
    const [custo_por_unidade, setCusto] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [messageAPI, setMessage] = useState("");
    const [errorAPI, setError] = useState("");

    const handleChangeCusto = (e) => {
        const custo_por_unidade = e.target.value;
        const custoConvert = parseFloat(custo_por_unidade) || 0; // Converte para inteiro ou usa 0 como fallback
        setPlantio(custoConvert);
      };

    const handleChangeQuantidade = (e) => {
        const qtd_estoque = e.target.value
        const quantidadeConvert = parseFloat(qtd_estoque) || 0;
        setColhida(quantidadeConvert)
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      
      try {
        const response = await api.post(
          "/input",
          {
            nome,
            tipo,
            medida,
            qtd_estoque,
            custo_por_unidade,
            fornecedor,
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
            <label htmlFor="nome">Nome: </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <label htmlFor="tipo">Tipo: </label>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            />
            <label htmlFor="medida">Medida: </label>
            <input
              type="text"
              value={medida}
              onChange={(e) => setMedida(e.target.value)}
              required
            />
            <label htmlFor="qtd_estoque">Quantidade Estoque: </label>
            <input
              type="number"
              value={qtd_estoque}
              onChange={handleChangeQuantidade}
              required
            />
            <label htmlFor="custo_por_unidade">Custo p/unidade: </label>
            <input
              type="number"
              value={custo_por_unidade}
              onChange={handleChangeCusto}
              required
            />
            <label htmlFor="fornecedor">Fornecedor: </label>
            <select value={fornecedor} onChange={(e) => setFornecedor(e.target.value)}>
                <option value="" disabled>Selecione...</option>
                {list.map((option, index) => (
                    <option key={index} value={option.nome}>
                    {option.nome}
                  </option>
                ))}
            </select>
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

const Insumos = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fornecedoresAPI, setCulturasAPI] = useState("");

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/inputs", {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
          },
        });

        const  responseFornecedor = await api.get("/suppliers", {
            headers: {
              Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
            },
          });

        setData(response.data); // Armazenando os dados protegidos na state
        setCulturasAPI(responseFornecedor.data)
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

  const [insumoSelecionado, setInsumoSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal e definir o usuário selecionado
  const abrirModal = (insumo) => {
    setInsumoSelecionado(insumo);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setInsumoSelecionado(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Appbar />
      <main>
        <Sidebar />
        <section className="main-container">
        <h2>Tabela de Insumos</h2>
        <article className="create-user">
            <AlertModal
                  show={showModal}
                  message="Cria Insumo"
                  onCancel={cancelModal}
                  list={fornecedoresAPI}
              />
            <button onClick={openModal} className="cria-user">Criar Insumos</button>
          </article>
          <article className="tabela-container">
            {data ? (
                <table className="tabela">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fornecedor</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((insumo) => (
                    <tr key={insumo.insumo_id} onClick={() => abrirModal(insumo)}>
                      <td>{insumo.insumo_id}</td>
                      <td>{insumo.fornecedor_nome}</td>
                      <td>{insumo.nome}</td>
                      <td>{insumo.tipo}</td>
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
                <h3>Detalhes do Insumo</h3>
                <div className="infos">
                  <p><strong>ID:</strong> {insumoSelecionado.insumo_id}</p>
                  <p><strong>Fornecedor:</strong> {insumoSelecionado.fornecedor_nome}</p>
                  <p><strong>Nome:</strong> {insumoSelecionado.nome}</p>
                  <p><strong>Tipo:</strong> {insumoSelecionado.tipo}</p>
                  <p><strong>Unidade de medida:</strong> {insumoSelecionado.unidade_medida}</p>
                  <p><strong>Quantidade estoque:</strong> {insumoSelecionado.quantidade_estoque}</p>
                  <p><strong>Custo Unidade:</strong> {insumoSelecionado.custo_por_unidade}</p>
                  <p><strong>Observações:</strong> {insumoSelecionado.observacoes}</p>
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

export default Insumos;
