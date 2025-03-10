import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout"; // El layout principal
import Home from "./pages/Home"; // Página Home
import ChildList from "./pages/ChildList"; // Página Lista de Elementos
import Login from "./pages/Login"; // Página Login
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import RoomsList from "./pages/RoomsList";

const App = () => {
  return (
    <Routes>
      {/* Ruta de login (fuera del layout) */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas dentro del layout */}
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="inscripciones" element={<ChildList />} />
          <Route path="grupos" element={<RoomsList />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
