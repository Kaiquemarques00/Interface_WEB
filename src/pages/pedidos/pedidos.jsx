import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Appbar from "../../components/appbar/appbar.jsx";
import api from "../../service/api.js";


const AlertModal = ({ show, message, onCancel, list, list2 }) => {
    if (!show) return null;
    const [usuario_id, setUsuario] = useState("");
    const [status, setStatus] = useState("");
    const [cultura, setCultura] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [preco_unitario, setPreco] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [messageAPI, setMessage] = useState("");
    const [errorAPI, setError] = useState("");

    const handleChangeUsuario = (e) => {
        const usuario_id = e.target.value;
        const usuarioConvert = parseInt(usuario_id) || 0; // Converte para inteiro ou usa 0 como fallback
        setUsuario(usuarioConvert);
    };

    const handleChangePreco = (e) => {
        const preco_unitario = e.target.value;
        const precoConvert = parseFloat(preco_unitario) || 0; // Converte para inteiro ou usa 0 como fallback
        setPreco(precoConvert);
    };

    const handleChangeQuantidade = (e) => {
        const quantidade = e.target.value
        const quantidadeConvert = parseInt(quantidade) || 0;
        setQuantidade(quantidadeConvert)
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      
      try {
        const response = await api.post(
          "/order",
          {
            status,
            usuario_id,
            cultura,
            quantidade,
            preco_unitario,
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
            <label htmlFor="usuario_id">Usuario ID: </label>
            <select value={usuario_id} onChange={handleChangeUsuario}>
                <option value="" disabled>Selecione...</option>
                {list2.map((option, index) => (
                    <option key={index} value={option.usuario_id}>
                    {option.usuario_id}
                  </option>
                ))}
            </select>
            <label htmlFor="cultura">Cultura: </label>
            <select value={cultura} onChange={(e) => setCultura(e.target.value)}>
                <option value="" disabled>Selecione...</option>
                {list.map((option, index) => (
                    <option key={index} value={option.nome}>
                    {option.nome}
                  </option>
                ))}
            </select> 
            <label htmlFor="quantidade">Quantidade: </label>
            <input
              type="number"
              value={quantidade}
              onChange={handleChangeQuantidade}
              required
            />
            <label htmlFor="preco_unitario">Preço p/unidade: </label>
            <input
              type="number"
              value={preco_unitario}
              onChange={handleChangePreco}
              required
            />
            <label htmlFor="status">Status: </label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="" disabled>Selecione...</option>
                <option value="planejado" >Pendente</option>
                <option value="em andamento" >Em andamento</option>
                <option value="concluido" >Concluido</option>
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

const Pedidos = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [usuariosAPI, setUsuariosAPI] = useState("");
  const [culturasAPI, setCulturasAPI] = useState("");

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
          },
        });

        const responseUsuario = await api.get("/users", {
            headers: {
              Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
            },
          });

        const responseCultura = await api.get("/cultures", {
            headers: {
              Authorization: `Bearer ${token}`, // Enviando o token JWT no cabeçalho
            },
          });

        setData(response.data); // Armazenando os dados protegidos na state
        setUsuariosAPI(responseUsuario.data)
        setCulturasAPI(responseCultura.data)
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

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal e definir o usuário selecionado
  const abrirModal = (pedido) => {
    setPedidoSelecionado(pedido);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setPedidoSelecionado(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Appbar />
      <main>
        <Sidebar />
        <section className="main-container">
        <h2>Tabela de Pedidos</h2>
        <article className="create-user">
            <AlertModal
                  show={showModal}
                  message="Cria Pedido"
                  onCancel={cancelModal}
                  list={culturasAPI}
                  list2={usuariosAPI}
              />
            <button onClick={openModal} className="cria-user">Criar Pedido</button>
          </article>
          <article className="tabela-container">
            {data ? (
                <table className="tabela">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cultura</th>
                    <th>Status</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((pedido) => (
                    <tr key={pedido.pedido_id} onClick={() => abrirModal(pedido)}>
                      <td>{pedido.pedido_id}</td>
                      <td>{pedido.cultura_nome}</td>
                      <td>{pedido.status}</td>
                      <td>{pedido.data_pedido}</td>
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
                <h3>Detalhes do Pedido</h3>
                <div className="infos">
                  <p><strong>ID:</strong> {pedidoSelecionado.pedido_id}</p>
                  <p><strong>Cultura:</strong> {pedidoSelecionado.cultura_nome}</p>
                  <p><strong>Quantidade:</strong> {pedidoSelecionado.quantidade}</p>
                  <p><strong>Preço p/unidade:</strong> {pedidoSelecionado.preco_unitario}</p>
                  <p><strong>Data pedido:</strong> {pedidoSelecionado.data_pedido}</p>
                  <p><strong>Status:</strong> {pedidoSelecionado.status}</p>
                  <p><strong>Usuário ID:</strong> {pedidoSelecionado.usuario_id}</p>
                  <p><strong>Observações:</strong> {pedidoSelecionado.observacoes}</p>
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

export default Pedidos;
