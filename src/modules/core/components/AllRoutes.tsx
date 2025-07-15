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
import Signup from "../../auth/Components/Signup";
import NotFound from "../../auth/Components/NotFound";
import ForgotPassword from "../../auth/Components/ForgotPassword";
import ResetPassword from "../../auth/Components/ResetPassword";
import TramitePendiente from "../../tramite/components/TramitePendiente";
import TramiteRecibido from "../../tramite/components/TramiteRecibido";
import Usuario from "../../usuario/components/Usuario";
import Empresa from "../../empresa/components/Empresa";
import TramiteEmitido from "../../tramite/components/TramiteEmitido";

const AllRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={""}>
              <Route path="login" element={<Login />}></Route>
              <Route path="signup" element={<Signup />}></Route>
              <Route path="forgot_password" element={<ForgotPassword />}></Route>
              <Route path="reset_password/:token" element={<ResetPassword />}></Route>
            </Route>

            <Route path="/dashboard" element={<Dashboard />}></Route>

            <Route path="/" element={<Dashboard />}>
              <Route path="firma_digital/archivos_digitales" element={<FileManager />}></Route>

              <Route path="tramite/pendiente" element={<TramitePendiente />}></Route>
              <Route path="tramite/recibido" element={<TramiteRecibido />}></Route>
              <Route path="tramite/emitido" element={<TramiteEmitido />}></Route>
              
              <Route path="mantenimiento/usuario" element={<Usuario />}></Route>
              <Route path="mantenimiento/empresa" element={<Empresa />}></Route>
              <Route path="mantenimiento/area" element={<Area />}></Route>
              <Route path="mantenimiento/cargo" element={<Cargo />}></Route>
              <Route path="mantenimiento/estado" element={<Estado />}></Route>
              <Route path="mantenimiento/esquema_estado" element={<EsquemaEstado />}></Route>
              <Route path="mantenimiento/rol" element={<Rol />}></Route>
              <Route path="mantenimiento/tipo_documento" element={<TipoDocumento />}></Route>
              <Route path="mantenimiento/tipo_usuario" element={<TipoUsuario />}></Route>
              <Route path="mantenimiento/tipo_tramite" element={<TipoTramite />}></Route>
              <Route path="mantenimiento/tipo_identificacion" element={<TipoIdentificacion />}></Route>
            </Route>

            <Route path="nofound" element={<NotFound />}></Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default AllRoutes;
