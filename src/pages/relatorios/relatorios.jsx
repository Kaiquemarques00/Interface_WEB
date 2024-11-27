import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Appbar from "../../components/appbar/appbar.jsx";
import api from "../../service/api.js";

import "./relatorio.style.css";

const Relatorios = () => {
    const [vendaPeriodo, setVendaPeriodo] = useState("");
    const [vendaCultura, setVendaCultura] = useState("");
    const [vendaReceita, setVendaReceita] = useState("");
    const [plantioPeriodo, setPlantioPeriodo] = useState("");
    const [plantioCultura, setPlantioCultura] = useState("");
    const [plantioStatus, setPlantioStatus] = useState("");
    const [colheitaPeriodo, setColheitaPeriodo] = useState("");
    const [insumosFornecedores, setInsumoFornecedor] = useState("");

    const [error, setError] = useState("");


    useEffect(() => {
        const fetchProtectedData = async () => {
            
        const token = localStorage.getItem("token");

          try {
            const responseSP = await api.get(`/report/sale/period?mesI=10&mesF=12`, { headers: { Authorization: `Bearer ${token}`, } });
            const responseSC = await api.get(`/report/sale/culture`, { headers: { Authorization: `Bearer ${token}`, } });
            const responseSR = await api.get(`/report/sale/revenue`, { headers: { Authorization: `Bearer ${token}`, } });
            const responsePP = await api.get(`/report/plantings/period?mesI=10&mesF=12`, { headers: { Authorization: `Bearer ${token}`, } });
            const responsePC = await api.get(`/report/plantings/cultures`, { headers: { Authorization: `Bearer ${token}`, } });
            const responsePS = await api.get(`/report/plantings/status`, { headers: { Authorization: `Bearer ${token}`, } });
            const responseCP = await api.get(`/report/harvest/period?mesI=10&mesF=12`, { headers: { Authorization: `Bearer ${token}`, } });
            const responseIF = await api.get(`/report/inputs/suppliers`, { headers: { Authorization: `Bearer ${token}`, } });
    
            setVendaPeriodo(responseSP.data);
            setVendaCultura(responseSC.data);
            setVendaReceita(responseSR.data);
            setPlantioPeriodo(responsePP.data);
            setPlantioCultura(responsePC.data);
            setPlantioStatus(responsePS.data);
            setColheitaPeriodo(responseCP.data);
            setInsumoFornecedor(responseIF.data);
          } catch (error) {
            setError("Erro ao carregar dados protegidos.");
          }
        };
    
        fetchProtectedData();
      }, []);

    return ( 
        <>
            <Appbar />
            <main>
                <Sidebar />
                <section>
                    {vendaPeriodo ? (
                        <article className="relatorio-container">
                            <h2>Vendas último mês</h2>
                            <div>
                                <p><strong>Quantidade: </strong>{vendaPeriodo}</p>
                                <p><strong>Receita Total: </strong>{vendaReceita.receita_total.receita_total}</p>
                            </div>
                        </article>
                    ) : (
                        <p>Carregando dados...</p>
                    )}
                    
                    {vendaCultura ? (
                        <article className="relatorio-container">
                            <h2>Culturas mais vendidas</h2>
                            {vendaCultura.map((venda) => (
                                <div key={venda.cultura_nome}>
                                    <p><strong>Cultura: </strong>{venda.cultura_nome}</p>
                                    <p><strong>Quantidade: </strong>{venda.frequencia}</p>
                                </div>
                            ))}
                        </article>
                    ) : (
                        <p>Carregando dados...</p>
                    )}

                    {plantioPeriodo ? (
                        <article className="relatorio-container">
                            <h2>Plantios último mês</h2>
                            <div>
                                <p><strong>Plantios total: </strong>{plantioPeriodo}</p>
                                <br />
                                <h3>Culturas Plantadas: </h3>
                                {plantioCultura.map((plantio) => (
                                <div key={plantio.cultura_nome}>
                                    <p><strong>Cultura: </strong>{plantio.cultura_nome}</p>
                                    <p><strong>Quantidade Plantada: </strong>{plantio.frequencia}</p>
                                </div>
                                ))}
                                <br />
                                <h3>Status dos plantios: </h3>
                                {plantioStatus.map((plantio) => (
                                <div key={plantio.status}>
                                    <p><strong>Status: </strong>{plantio.status}</p>
                                    <p><strong>Quantidade Plantada: </strong>{plantio.frequencia}</p>
                                </div>
                                ))}
                            </div>
                        </article>
                    ) : (
                        <p>Carregando dados...</p>
                    )}

                    {colheitaPeriodo ? (
                        <article className="relatorio-container">
                            <h2>Colheitas último mês</h2>
                            <div>
                                <p><strong>Quantidade: </strong>{colheitaPeriodo}</p>
                            </div>
                        </article>
                    ) : (
                        <p>Carregando dados...</p>
                    )}

                    {insumosFornecedores ? (
                        <article className="relatorio-container">
                            <h2>Principais fornecedores de insumos</h2>
                            {insumosFornecedores.map((insumo) => (
                                <div key={insumo.fornecedor_nome}>
                                    <p><strong>Fornecedor: </strong>{insumo.fornecedor_nome}</p>
                                    <p><strong>Quantidade: </strong>{insumo.frequencia}</p>
                                </div>
                            ))}
                        </article>
                    ) : (
                        <p>Carregando dados...</p>
                    )}
                </section>
            </main>
        </>
     );
}
 
export default Relatorios;