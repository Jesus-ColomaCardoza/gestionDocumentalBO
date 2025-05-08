import { Card } from "primereact/card";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div
          style={{
            borderRadius: "15px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 50%, rgba(33, 150, 243, 0) 100%)",
          }}
        >
          <Card
            className="w-full py-8 px-5 sm:px-8 flex flex-column align-items-center"
            style={{ borderRadius: "15px" }}
          >
            <p className="text-blue-500 font-bold text-7xl text-center m-0">404</p>
            <h1 className="text-900 font-bold text-5xl mb-2">No encontrado</h1>
            <div className="text-600 mb-5">
              Recurso no esta disponible
            </div>
            <Link
              to="/auth/login"
              className="w-full flex align-items-center py-5 no-underline"
            >
              <span
                className="flex justify-content-center align-items-center bg-blue-500 border-round"
                style={{ height: "3.5rem", width: "3.5rem" }}
              >
                <i className="text-50 pi pi-arrow-circle-left text-2xl text-white"></i>
              </span>
              <span className="ml-4 flex flex-column">
                <span className="text-900 lg:text-xl font-medium  mb-1">
                  Volver a inicio
                </span>
          
              </span>
            </Link>

  
          </Card>
        </div>
      </div>
  );
};

export default NotFound;
