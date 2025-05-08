import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Area from "../../area/components/Area";
import TipoUsuario from "../../tipo-usuario/components/TipoUsuario";
import FileManager from "../../file-manager/components/FileManger";
import TipoDocumento from "../../tipo-documento/components/TipoDocumento";
import Cargo from "../../cargo/components/Cargo";
import TipoTramite from "../../tipo-tramite/components/TipoTramite";
import TipoIdentificacion from "../../tipo-identificacion/components/TipoIdentificacion";
import EsquemaEstado from "../../esquema-estado/components/EsquemaEstado";
import Estado from "../../estado/components/Estado";
import Rol from "../../rol/components/Rol";
import Login from "../../auth/Components/Login";
import { AuthProvider } from "../../auth/context/AuthContext";

const AllRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={""}>
              <Route path="login" element={<Login />}></Route>
            </Route>

            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="file_manager" element={<FileManager />}></Route>
              <Route path="area" element={<Area />}></Route>
              <Route path="tipo_usuario" element={<TipoUsuario />}></Route>
              <Route path="tipo_documento" element={<TipoDocumento />}></Route>
              <Route path="cargo" element={<Cargo />}></Route>
              <Route path="tipo_tramite" element={<TipoTramite />}></Route>
              <Route
                path="tipo_identificacion"
                element={<TipoIdentificacion />}
              ></Route>
              <Route path="esquema_estado" element={<EsquemaEstado />}></Route>
              <Route path="estado" element={<Estado />}></Route>
              <Route path="rol" element={<Rol />}></Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default AllRoutes;
