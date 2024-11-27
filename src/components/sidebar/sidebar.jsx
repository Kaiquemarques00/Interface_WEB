import React from 'react';
import { useNavigate } from 'react-router-dom';

import iconHome from '../../assets/icone_home.svg'
import iconUsuario from '../../assets/icone_perfil_2.svg'
import iconCultura from '../../assets/icone_cultura.svg'
import iconPlantio from '../../assets/icone_plantio.svg'
import iconColheita from '../../assets/icone_colheita.svg'
import iconInsumo from '../../assets/icone_insumos.svg'
import iconFornecedor from '../../assets/icone_fornecedores.svg'
import iconPedido from '../../assets/icone_financeiro.svg'
import iconRelatorio from '../../assets/icone_prancheta.svg'

import "./sidebar.style.css"

const Sidebar = () => {
    const navigate = useNavigate();

    const navButtons = [
        { path: '/home', label: 'Home', icone: iconHome },
        { path: '/usuarios', label: 'Usuarios', icone: iconUsuario },
        { path: '/culturas', label: 'Culturas', icone: iconCultura },
        { path: '/plantios', label: 'Plantios', icone: iconPlantio },
        { path: '/colheitas', label: 'Colheitas', icone: iconColheita },
        { path: '/insumos', label: 'Insumos', icone: iconInsumo },
        { path: '/fornecedores', label: 'Fornecedores', icone: iconFornecedor },
        { path: '/pedidos', label: 'Pedidos', icone: iconPedido },
        { path: '/relatorios', label: 'Relatórios', icone: iconRelatorio },
      ];

    return ( 
        <nav>
            {navButtons.map((button) => (
        <button
          key={button.path}
          onClick={() => navigate(button.path)}
          className={`nav-button ${location.pathname === button.path ? 'active' : ''}`}
        >
          <img src={button.icone} alt={`Icone de ${button.label}`}  />
          <p>{button.label}</p>
        </button>
      ))}
        </nav>
     );
}
 
export default Sidebar;