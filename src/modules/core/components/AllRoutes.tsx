import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Area from "../../area/components/Area";
import Cargo from "../../cargo/components/Cargo";
import Rol from "../../rol/components/Rol";
import TipoUsuario from "../../tipo-usuario/components/TipoUsuario";
import TipoDocumento from "../../tipo-documento/components/TipoDocumento";

const AllRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="area" element={<Area />}></Route>
            <Route path="tipo_usuario" element={<TipoUsuario />}></Route>
            <Route path="tipo_documento" element={<TipoDocumento />}></Route>

            {/* <Route path="cargo" element={<Cargo />}></Route>
            <Route path="rol" element={<Rol />}></Route> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AllRoutes;
