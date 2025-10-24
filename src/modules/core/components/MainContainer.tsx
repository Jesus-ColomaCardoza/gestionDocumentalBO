import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import { Carousel } from "primereact/carousel";

type MainContainerProps = {
  visible?: boolean;
};

const MainContainer = ({ visible }: MainContainerProps) => {
  const refMainContainer = useRef<Card>(null);

  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { userAuth } = useAuth()!;

  const dashboardCards = [
    {
      title: "Trámites Pendientes",
      value: "12",
      icon: "pi pi-clock",
      color: "bg-orange-500",
      route: "/tramites/pendientes",
    },
    {
      title: "Trámites Recibidos",
      value: "8",
      icon: "pi pi-inbox",
      color: "bg-blue-500",
      route: "/tramites/recibidos",
    },
    {
      title: "Documentos por Firmar",
      value: "3",
      icon: "pi pi-pencil",
      color: "bg-purple-500",
      route: "/firma-digital",
    },
    {
      title: "Archivos Digitales",
      value: "25",
      icon: "pi pi-folder",
      color: "bg-green-500",
      route: "/archivos-digitales",
    },
  ];

  const [images, setImages] = useState<string[]>([]);

  const sampleImages = [
    "https://scontent.fpiu2-2.fna.fbcdn.net/v/t39.30808-6/552822438_812622635053847_584535605293799980_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGAfxqQfy3q_i6HNp-bwQJIvc5l_8VyyJK9zmX_xXLIkg582SfPfooexZWjHJHq3szW4gsoG8yZgC4ihM_5Hj0H&_nc_ohc=k-VQ8dZCHGwQ7kNvwEFD9Fx&_nc_oc=AdkFEZ5OqPRrNat8Sy0kuvKqJX1yMZ2xXSBbBtnnG2vcHQfh1qM3ZZWfLQC4gL9nSSo&_nc_zt=23&_nc_ht=scontent.fpiu2-2.fna&_nc_gid=WS2w8ya2BQLDsb8lDolkwg&oh=00_AfcU3BmxW2rEVxxfP2kxpYnmKUf4lPeNJwc0YSdFaZqz3g&oe=68FFA338",
    "https://scontent.fpiu2-1.fna.fbcdn.net/v/t39.30808-6/542690515_795970536719057_8526782690322548958_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFjtis6Bgid38QFptlAeeItLnvJxAsYIswue8nECxgizEB__hR6Z4ZS2bsbKZ16NX0f35nXCrMEf197IhnR0yel&_nc_ohc=VOBPttuLXVoQ7kNvwEaIMJW&_nc_oc=Adknv2NA5HrhDenQB0IPKDirhnVPxP79rDtiJRHtWHjlokyCWY6hjEZWd3FKqClDbNA&_nc_zt=23&_nc_ht=scontent.fpiu2-1.fna&_nc_gid=jj7AwDEo3sw39mwpi-5Nsw&oh=00_AfcxVfP00NBI_Z1ikgkbdcd5ePRO0cTF3kOhrT83Q-hXpg&oe=68FFB2FF",
    "https://scontent.fpiu2-2.fna.fbcdn.net/v/t39.30808-6/539553067_791333193849458_5278572874798904491_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFO8yYmDAXVeUeaK6bm_bTK-6IphbVvs437oimFtW-zjZgbwPFEZGvvmOXrRRWIOqhhTkVYOwBAMlNkvNYHTHp0&_nc_ohc=ynqOxUeDxs8Q7kNvwHpoL8S&_nc_oc=AdmIZUL-O4YfGjLvgpJYT065eLiX11GghM0WPX7xFnMJTf4g3TlTjzND9iolm0hTzg4&_nc_zt=23&_nc_ht=scontent.fpiu2-2.fna&_nc_gid=x5q-tAQe-TmdxjFJHnRoGg&oh=00_AfdzKndrPExULifziu_pfbOSmxbWhf1gu61YoXyE6TLssw&oe=68FFAE2F",
    "https://scontent.fpiu2-1.fna.fbcdn.net/v/t39.30808-6/536281932_788533107462800_4764790020214456910_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG76KV2WGKkGx6gcrsuTZ-qOu4t5_kfJPc67i3n-R8k97ywfO9x3hweaG7UYFkhRN2BBTEKXsf_N08KhllcRkyA&_nc_ohc=CAVi2O0uuMwQ7kNvwHGBhmT&_nc_oc=AdmaAIt3SmStT3YWZB_hWp2NDEfcm1eH3JRVd4NWsulUpPPq2_TpKFsIEbtbS_9W8Lw&_nc_zt=23&_nc_ht=scontent.fpiu2-1.fna&_nc_gid=_wcDx5b5Y8n3330NTkmWBg&oh=00_AfcdCGCkFYy7vVw2SwzU1ZnaDAqdpDmeMc0_buOVd2FtAQ&oe=68FF8D8F",
    "https://scontent.fpiu2-1.fna.fbcdn.net/v/t39.30808-6/536481914_783452501304194_4992458065599789472_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFs46MhYyMR1tVOVEKHdGTf7B_Qy0HrUjTsH9DLQetSNIoIFSPPR3dNSSCLElt7s8zzD_slvWhhlz8T6ejQVPPy&_nc_ohc=l1kE7azd8jgQ7kNvwEASugr&_nc_oc=AdnI_vC3_EbPbPq5HLQmlFQg4_WYKPQ9KMH4Bxtvn65y7gJnbkFYHwpLft78zWg4bno&_nc_zt=23&_nc_ht=scontent.fpiu2-1.fna&_nc_gid=dMD3toTRiJO8Mqsp-WDEbA&oh=00_Afdf8FJQrlb48Wk9dV9GUqDvUzKBGTrrAW5gt-QOB0LJWQ&oe=68FF9F81",
  ];

  useEffect(() => {
    setImages(sampleImages);
  }, []);

  const imageTemplate = (imageUrl: string) => {
    return (
      <div className="border-1 surface-border border-round m-2 overflow-hidden">
        <img
          src={imageUrl}
          alt="Carousel image"
          className="w-full h-15rem object-cover"
        />
      </div>
    );
  };

  return (
    <Card
      ref={refMainContainer}
      content="c"
      style={{
        backgroundColor: "var(--surface-50)",
        width: visible ? "calc(100% - 20rem)" : "calc(100% - 2rem)",
        margin: "1rem",
        minHeight: "calc(100vh - 6rem)",
        transition: ".5s width ease-in-out",
      }}
    >
      {pathname === "/dashboard" ? (
        <>
          <div className="px-4">
            {/* Bienvenida */}
            <div className="mb-4">
              <h1 className="text-2xl  mt-0 mb-2">
                {`Bienvenido, ${userAuth?.Nombres} ${
                  userAuth?.ApellidoPaterno || ""
                }`}
              </h1>
              <p className="text-color-secondary">
                Sistema de Gestión Documental - SIGED FAIQUE
              </p>
            </div>

            {/* Tarjetas de resumen */}
            <div className="grid mb-4">
              {dashboardCards.map((card, index) => (
                <div key={index} className="col-12 md:col-6 lg:col-3">
                  <Card
                    className="cursor-pointer hover:shadow-4 transition-duration-200 border-1 surface-border"
                    // onClick={() => navigate(card.route)}
                  >
                    <div className="flex justify-content-between align-items-center">
                      <div>
                        <span className="block text-500 font-medium mb-2 text-sm">
                          {card.title}
                        </span>
                        <div className="text-900 font-medium text-2xl">
                          {card.value}
                        </div>
                      </div>
                      <div
                        className={`flex align-items-center justify-content-center border-round ${card.color}`}
                        style={{ width: "3rem", height: "3rem" }}
                      >
                        <i className={`${card.icon} text-white text-xl`}></i>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Accesos rápidos y actividad */}
            <div className="grid">
              {/* Accesos rápidos */}
              <div className="col-4 lg:col-3">
                <Card title="Accesos Rápidos" className="h-full">
                  <div className="flex flex-column gap-2">
                    <Button
                      label="Nuevo Trámite"
                      icon="pi pi-plus"
                      className="mb-2 justify-content-start"
                      style={{
                        color:"#fff",
                        border:"none"
                      }}
                      onClick={() => navigate("../tramite/emitido/nuevo")}
                    />
                    {/* <Button
                      label="Firma Digital"
                      icon="pi pi-pencil"
                      severity="secondary"
                      className="mb-2 justify-content-start"
                      onClick={() => navigate("/firma-digital")}
                    /> */}
                    <Button
                      label="Archivos Digitales"
                      icon="pi pi-folder-open"
                      className="mb-2 justify-content-start bg-green-500"
                      style={{
                        color:"#fff",
                        border:"none"
                      }}
                      onClick={() =>
                        navigate("../firma_digital/archivos_digitales")
                      }
                    />
                    <Button
                      label="Trámites Pendientes"
                      icon="pi pi-info-circle"
                      className="mb-2 justify-content-start bg-orange-500"
                      style={{
                        color:"#fff",
                        border:"none"
                      }}
                      onClick={() => navigate("../tramite/pendiente")}
                    />
                    {/* <Button
                      label="Reportes"
                      icon="pi pi-chart-bar"
                      severity="success"
                      className="mb-2 justify-content-start"
                      onClick={() => navigate("/reportes")}
                    /> */}
                  </div>
                </Card>
              </div>

              {/* Actividad reciente */}
              <div className="col-8 lg:col-9">
                <div className="card">
                  <Carousel
                    value={images}
                    numVisible={2}
                    numScroll={2}
                    responsiveOptions={[
                      {
                        breakpoint: "1400px",
                        numVisible: 2,
                        numScroll: 1,
                      },
                      {
                        breakpoint: "1199px",
                        numVisible: 3,
                        numScroll: 1,
                      },
                      {
                        breakpoint: "767px",
                        numVisible: 2,
                        numScroll: 1,
                      },
                      {
                        breakpoint: "575px",
                        numVisible: 1,
                        numScroll: 1,
                      },
                    ]}
                    className="custom-carousel"
                    circular
                    autoplayInterval={5000}
                    itemTemplate={imageTemplate}
                  />
                </div>
              </div>
              {/* <div className="col-12 lg:col-8">
                <Card title="Actividad Reciente" className="h-full">
                  <div className="flex flex-column gap-3">
                    <div className="flex align-items-center gap-3 p-3 border-round border-1 surface-border">
                      <Avatar
                        icon="pi pi-file-edit"
                        size="large"
                        shape="circle"
                        className="bg-green-100 text-green-800"
                      />
                      <div className="flex-1">
                        <span className="font-medium block">
                          Documento firmado
                        </span>
                        <div className="text-sm text-color-secondary">
                          Ofício N° 2024-001-MP-FC
                        </div>
                      </div>
                      <span className="text-sm text-color-secondary">
                        Hace 2 horas
                      </span>
                    </div>

                    <div className="flex align-items-center gap-3 p-3 border-round border-1 surface-border">
                      <Avatar
                        icon="pi pi-send"
                        size="large"
                        shape="circle"
                        className="bg-blue-100 text-blue-800"
                      />
                      <div className="flex-1">
                        <span className="font-medium block">
                          Trámite derivado
                        </span>
                        <div className="text-sm text-color-secondary">
                          Expediente 2024-0056
                        </div>
                      </div>
                      <span className="text-sm text-color-secondary">
                        Hace 4 horas
                      </span>
                    </div>

                    <div className="flex align-items-center gap-3 p-3 border-round border-1 surface-border">
                      <Avatar
                        icon="pi pi-inbox"
                        size="large"
                        shape="circle"
                        className="bg-orange-100 text-orange-800"
                      />
                      <div className="flex-1">
                        <span className="font-medium block">
                          Trámite recibido
                        </span>
                        <div className="text-sm text-color-secondary">
                          Solicitud 2024-0089
                        </div>
                      </div>
                      <span className="text-sm text-color-secondary">
                        Hace 6 horas
                      </span>
                    </div>

                    <div className="flex align-items-center gap-3 p-3 border-round border-1 surface-border">
                      <Avatar
                        icon="pi pi-check-circle"
                        size="large"
                        shape="circle"
                        className="bg-purple-100 text-purple-800"
                      />
                      <div className="flex-1">
                        <span className="font-medium block">
                          Trámite atendido
                        </span>
                        <div className="text-sm text-color-secondary">
                          Reclamo 2024-0034
                        </div>
                      </div>
                      <span className="text-sm text-color-secondary">Ayer</span>
                    </div>
                  </div>
                </Card>
              </div> */}
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid">
              <div className="col-12">
                <Card title="Resumen del Sistema">
                  <div className="grid">
                    <div className="col-6 md:col-3 text-center">
                      <div className="text-900 font-bold text-xl">156</div>
                      <div className="text-500 text-sm">Total Trámites</div>
                    </div>
                    <div className="col-6 md:col-3 text-center">
                      <div className="text-900 font-bold text-xl">89</div>
                      <div className="text-500 text-sm">Completados</div>
                    </div>
                    <div className="col-6 md:col-3 text-center">
                      <div className="text-900 font-bold text-xl">42</div>
                      <div className="text-500 text-sm">En Proceso</div>
                    </div>
                    <div className="col-6 md:col-3 text-center">
                      <div className="text-900 font-bold text-xl">25</div>
                      <div className="text-500 text-sm">Pendientes</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>{" "}
        </>
      ) : (
        <Outlet />
      )}
    </Card>
  );
};

export default MainContainer;
