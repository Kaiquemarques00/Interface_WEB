import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Appbar from "../../components/appbar/appbar.jsx";
import api from "../../service/api.js";


const AlertModal = ({ show, message, onCancel }) => {
    if (!show) return null;
    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [cep, setCep] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [messageAPI, setMessage] = useState("");
    const [errorAPI, setError] = useState("");

    const handleChangeNumero = (e) => {
        const numero = e.target.value;
        const numeroConvert = parseInt(numero) || 0; // Converte para inteiro ou usa 0 como fallback
        setNumero(numeroConvert);
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      
      try {
        const response = await api.post(
          "/supplier",
          {
            nome,
            cnpj,
            email,
            telefone,
            rua,
            numero,
            bairro,
            cidade,
            estado,
            cep,
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
            <label htmlFor="cnpj">CNPJ: </label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
            <label htmlFor="email">E-mail: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="telefone">Telefone: </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
            <label htmlFor="rua">Rua: </label>
            <input
              type="text"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              required
            />
            <label htmlFor="numero">Número: </label>
            <input
              type="number"
              value={numero}
              onChange={handleChangeNumero}
              required
            />
            <label htmlFor="bairro">Bairro: </label>
            <input
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              required
            />
            <label htmlFor="cidade">Cidade: </label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
            />
            <label htmlFor="estado">Estado: </label>
            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
            />
            <label htmlFor="cep">CEP: </label>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
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

const Fornecedores = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/suppliers", {
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

  const openModal = () => {
    setShowModal(true);
  }; 
  
  const cancelModal = () => {
    setShowModal(false); // Esconde o modal
  };

  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal e definir o usuário selecionado
  const abrirModal = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const fecharModal = () => {
    setFornecedorSelecionado(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <Appbar />
      <main>
        <Sidebar />
        <section className="main-container">
        <h2>Tabela de Fornecedores</h2>
        <article className="create-user">
            <AlertModal
                  show={showModal}
                  message="Cria fornecedor"
                  onCancel={cancelModal}
              />
            <button onClick={openModal} className="cria-user">Criar Fornecedor</button>
          </article>
          <article className="tabela-container">
            {data ? (
                <table className="tabela">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>CNPJ</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((fornecedor) => (
                    <tr key={fornecedor.fornecedor_id} onClick={() => abrirModal(fornecedor)}>
                      <td>{fornecedor.fornecedor_id}</td>
                      <td>{fornecedor.nome}</td>
                      <td>{fornecedor.cnpj}</td>
                      <td>{fornecedor.email}</td>
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
                <h3>Detalhes do Fornecedor</h3>
                <div className="infos">
                  <p><strong>ID:</strong> {fornecedorSelecionado.fornecedor_id}</p>
                  <p><strong>Nome:</strong> {fornecedorSelecionado.nome}</p>
                  <p><strong>CNPJ:</strong> {fornecedorSelecionado.cnpj}</p>
                  <p><strong>Email:</strong> {fornecedorSelecionado.email}</p>
                  <p><strong>Telefone:</strong> {fornecedorSelecionado.telefone}</p>
                  <p><strong>Rua:</strong> {fornecedorSelecionado.rua}</p>
                  <p><strong>Número:</strong> {fornecedorSelecionado.numero}</p>
                  <p><strong>Bairro:</strong> {fornecedorSelecionado.bairro}</p>
                  <p><strong>Cidade:</strong> {fornecedorSelecionado.cidade}</p>
                  <p><strong>Estado:</strong> {fornecedorSelecionado.estado}</p>
                  <p><strong>CEP:</strong> {fornecedorSelecionado.cep}</p>
                  <p><strong>Observações:</strong> {fornecedorSelecionado.observacoes}</p>
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

export default Fornecedores;
