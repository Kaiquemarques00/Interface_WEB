import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";

  import Login from "../pages/login/login.jsx";
  import Home from "../pages/home.jsx";
  import Usuarios from "../pages/usuarios/usuarios.jsx";
  import Culturas from "../pages/culturas/culturas.jsx";
  import Plantios from "../pages/plantios/plantios.jsx";
  import Colheitas from "../pages/colheitas/colheitas.jsx";
  import Insumos from "../pages/insumos/insumos.jsx";
  import Fornecedores from "../pages/fornecedores/fornecedores.jsx";
  import Pedidos from "../pages/pedidos/pedidos.jsx";
  import Relatorios from "../pages/relatorios/relatorios.jsx";

  import { jwtDecode } from "jwt-decode";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
  
    // Verifica se o token existe
    if (!token) {
      return <Navigate to="/" />;
    }
  
    try {
      // Decodifica o token
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      // Verifica se o usuário tem a permissão correta
      const isAuthenticated = decodedToken.role === "Administrador" || decodedToken.role === "Funcionario";
  
      return isAuthenticated ? children : <Navigate to="/" />;
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return <Navigate to="/" />;
    }
  }

  function PrivateRouteAdmin({ children }) {
    const token = localStorage.getItem("token");
  
    // Verifica se o token existe
    if (!token) {
      return <Navigate to="/" />;
    }
  
    try {
      // Decodifica o token
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      // Verifica se o usuário tem a permissão correta
      const isAuthenticated = decodedToken.role === "Administrador"
  
      if (!isAuthenticated) {
        alert("Você não tem acesso a essa página")
      }
      return isAuthenticated ? children : <Navigate to="/home" />;
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      return <Navigate to="/" />;
    }
  }

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRouteAdmin>
              <Usuarios />
            </PrivateRouteAdmin>
          }
        />
        <Route
          path="/culturas"
          element={
            <PrivateRoute>
              <Culturas />
            </PrivateRoute>
          }
        />
        <Route
          path="/plantios"
          element={
            <PrivateRoute>
              <Plantios />
            </PrivateRoute>
          }
        />
        <Route
          path="/colheitas"
          element={
            <PrivateRoute>
              <Colheitas />
            </PrivateRoute>
          }
        />
        <Route
          path="/insumos"
          element={
            <PrivateRoute>
              <Insumos />
            </PrivateRoute>
          }
        />
        <Route
          path="/fornecedores"
          element={
            <PrivateRoute>
              <Fornecedores />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <Pedidos />
            </PrivateRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Relatorios />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};