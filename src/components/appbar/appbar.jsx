import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo3.png'
import iconeSair from '../../assets/icone_sair.svg'

import "./appbar.style.css"

const AlertModal = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>{message}</p>
          <div className="modal-actions">
            <button className="confirm-button" onClick={onConfirm}>Confirmar</button>
            <button className="cancel-button" onClick={onCancel}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  };



const Appbar = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [pendingRoute, setPendingRoute] = useState(null);

    const handleNavigation = () => {
        setPendingRoute("/");
        setShowModal(true);
    };

    const confirmNavigation = () => {
        localStorage.removeItem("token");
        setShowModal(false); // Esconde o modal
        if (pendingRoute) {
          navigate(pendingRoute); // Navega para a rota pendente
          setPendingRoute(null); // Limpa a rota pendente
        }
    };

    const cancelNavigation = () => {
        setShowModal(false); // Esconde o modal
        setPendingRoute(null); // Limpa a rota pendente
    };

    return ( 
        <header>
            <img src={logo} alt="Logo da empresa" />
            <button onClick={handleNavigation}>
                <img src={iconeSair} alt="Icone de sair" />
            </button>
            <AlertModal
                show={showModal}
                message="Deseja fazer o logout do sistema ?"
                onConfirm={confirmNavigation}
                onCancel={cancelNavigation}
            />
        </header>
     );
}
 
export default Appbar;