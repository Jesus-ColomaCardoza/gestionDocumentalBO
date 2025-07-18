import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { StyleClass } from "primereact/styleclass";
import { Card } from "primereact/card";
import "./../styles/Dashboard.css";
import { useRef } from "react";
import { Avatar } from "primereact/avatar";
import { useAuth } from "../../auth/context/AuthContext";

type SideBarProps = {
  visible?: boolean;
  setVisible: (value: boolean) => void;
};

const SideBar = (props: SideBarProps) => {
  const btnRef1 = useRef<any>(null);
  const btnRef2 = useRef<any>(null);
  const btnRef3 = useRef<any>(null);

  const refSideBar = useRef<Card>(null);

  const { userAuth } = useAuth()!;

  return (
    <Card
      ref={refSideBar}
      style={{
        backgroundColor: "var(--surface-50)",

        position: "sticky",
        top: "5rem",
        // marginRight: ".5em",
        height: "calc(100vh - 6rem)",
        width: props.visible ? "20rem" : "0rem",
        margin: props.visible ? "1rem" : "0rem",
        transform: props.visible ? "translateX(0rem)" : "translateX(-20rem)",
        transition:
          ".5s transform ease-in-out,.5s width ease-in-out,.5s margin ease-in-out",
      }}
      className="flex flex-column"
    >
      {/* Sidebar-header */}
      <div
        className="flex align-items-center justify-content-between px-2 flex-shrink-0"
        style={{
          position: "fixed",
          top: 20,
          boxSizing: "border-box",
          width: "90%",
        }}
      >
        <span className="inline-flex align-items-center gap-2">
          {/* logo */}
          {/* <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g mask="url(#mask0_2642_713)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M31.5357 13.0197L29.2036 17.0218L31.531 21.0161C32.3802 22.4733 32.3802 24.2131 31.5311 25.6702C30.682 27.1274 29.1612 27.9973 27.463 27.9973H22.8081L20.6555 31.6915C19.7975 33.164 18.2608 34.0431 16.5447 34.0431C14.8286 34.0431 13.2918 33.164 12.4337 31.6915L10.2811 27.9973H5.617C3.93113 27.9973 2.42136 27.1337 1.57841 25.6871C0.735451 24.2405 0.735451 22.5131 1.57841 21.0666L3.91045 17.0644L1.58298 13.0702C0.733895 11.613 0.733895 9.87311 1.58298 8.41596C2.43207 6.95878 3.95286 6.08884 5.65104 6.08884H10.306L12.4585 2.39474C13.3165 0.922318 14.8535 0.0430908 16.5695 0.0430908C18.2856 0.0430908 19.8223 0.922227 20.6803 2.39474L22.8329 6.08884H27.4971C29.183 6.08884 30.6927 6.95252 31.5357 8.3991C32.3787 9.84573 32.3787 11.573 31.5357 13.0197ZM16.5695 1.06124C15.225 1.0612 14.0208 1.74999 13.3486 2.90374L11.4927 6.08873H21.6463L19.7904 2.90374C19.1182 1.74999 17.914 1.06124 16.5695 1.06124ZM22.7105 26.1286L22.6607 26.2141L22.6534 26.2266L22.5337 26.432L21.8976 27.5237L21.7881 27.7117L20.4662 29.9803L20.0676 30.6643L19.7869 31.146L19.7763 31.1484L19.77 31.1592C19.0978 32.313 17.8714 32.6453 16.5269 32.6453C15.1843 32.6453 14.004 32.3149 13.3312 31.1641L13.31 31.1588L12.6277 29.9878L12.4567 29.6945L5.09715 17.0644L6.43206 14.7736L6.43225 14.7744L8.78685 10.7356L8.7852 10.7353L9.05248 10.2767L9.05421 10.277L10.9022 7.10709L22.2401 7.10314L28.017 17.0219L22.7105 26.1286ZM30.6411 25.1613C29.9777 26.2996 28.7896 26.9792 27.4629 26.9792H23.4014L28.6101 18.0401L30.641 21.5253C31.3043 22.6636 31.3043 24.0229 30.6411 25.1613ZM2.46839 25.178C3.1256 26.3058 4.30263 26.9791 5.617 26.9791H9.6878L4.50379 18.0826L2.46839 21.5756C1.81123 22.7035 1.81123 24.0502 2.46839 25.178ZM2.47303 12.5611C1.80969 11.4227 1.80969 10.0634 2.47303 8.92507C3.13632 7.78669 4.32437 7.10706 5.65105 7.10706H9.71266L4.50381 16.0462L2.47303 12.5611ZM27.497 7.10706C28.8114 7.10706 29.9885 7.78039 30.6456 8.90826C31.3028 10.036 31.3028 11.3827 30.6456 12.5106L28.6102 16.0036L23.4262 7.10706H27.497Z"
                fill="var(--primary-color)"
              />
            </g>
            <path
              d="M22.0969 18.6465L20.3461 18.2616L21.7078 20.1862V26.1522L26.0214 22.3031L26.3764 15.7598L24.2367 16.5296L22.0969 18.6465Z"
              fill="var(--primary-color)"
            />
            <path
              d="M11.2035 18.6465L12.9543 18.2616L11.5926 20.1862V26.1522L7.27906 22.3031L6.92397 15.7598L9.06376 16.5296L11.2035 18.6465Z"
              fill="var(--primary-color)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.1761 20.5713L13.7323 18.2618L14.7049 18.8392H18.5955L19.5681 18.2618L21.1243 20.5713V29.2316L19.3056 32.6659H13.6397L12.1761 29.2316V20.5713Z"
              fill="var(--primary-color)"
            />
            <path
              d="M21.7079 29.8089L24.2367 27.3071V24.8052L21.7079 26.9221V29.8089Z"
              fill="var(--primary-color)"
            />
            <path
              d="M11.5927 29.8089L9.06387 27.3071V24.8052L11.5927 26.9221V29.8089Z"
              fill="var(--primary-color)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.2613 7.09967H14.1215L12.5652 10.7563L15.0941 18.0694H18.401L20.7353 10.7563L19.1791 7.09967H17.0394V18.0694H16.2613V7.09967Z"
              fill="var(--primary-color)"
            />
            <path
              d="M15.0942 18.0694L6.7296 14.9901L5.56244 10.1788L12.7599 10.7562L15.2887 18.0694H15.0942Z"
              fill="var(--primary-color)"
            />
            <path
              d="M18.4011 18.0694L26.7658 14.9901L27.9329 10.1788L20.5409 10.7562L18.2066 18.0694H18.4011Z"
              fill="var(--primary-color)"
            />
            <path
              d="M21.1245 10.1789L24.8545 9.794L22.4862 7.09967H19.7628L21.1245 10.1789Z"
              fill="var(--primary-color)"
            />
            <path
              d="M12.1762 10.1789L8.4462 9.794L10.8145 7.09967H13.5378L12.1762 10.1789Z"
              fill="var(--primary-color)"
            />
          </svg> */}

          {/* text logo */}
          <span className="font-semibold text-2xl text-primary px-2">
            MDSMF
          </span>
        </span>

        {/* button close */}
        <span>
          <Button
            type="button"
            onClick={() => {
              props.setVisible(false);
            }}
            icon="pi pi-angle-double-left"
            outlined
            className="h-2rem w-2rem"
            style={{
              border: "none",
            }}
          ></Button>
        </span>
      </div>

      {/* Sidebar-body */}
      <div
        style={{
          marginTop: "1rem",
          height: "calc(100vh - 13rem)",
          overflowY: "auto",
        }}
      >
        <ul className="list-none px-2">
          <li>
            <StyleClass
              nodeRef={btnRef1}
              selector="@next"
              enterFromClassName="hidden"
              enterActiveClassName="slidedown"
              leaveToClassName="hidden"
              leaveActiveClassName="slideup"
            >
              <div
                ref={btnRef1}
                className="p-ripple p-2 flex align-items-center justify-content-between cursor-pointer text-600 border-round hover:surface-100 transition-duration-150 transition-colors"
              >
                <span className="font-medium">Firma Digital</span>
                <i className="pi pi-chevron-down"></i>
                <Ripple />
              </div>
            </StyleClass>
            <ul className="list-none p-0 m-0 overflow-hidden">
              <li>
                <Link
                  to={"../firma_digital/archivos_digitales"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-file mr-2"></i>
                  <span className="font-medium text-sm">
                    Archivos digitales
                  </span>
                  <Ripple />
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="list-none px-2 ">
          <li>
            <StyleClass
              nodeRef={btnRef2}
              selector="@next"
              enterFromClassName="hidden"
              enterActiveClassName="slidedown"
              leaveToClassName="hidden"
              leaveActiveClassName="slideup"
            >
              <div
                ref={btnRef2}
                className="p-ripple p-2 flex align-items-center justify-content-between cursor-pointer text-600 border-round hover:surface-100 transition-duration-150 transition-colors"
              >
                <span className="font-medium">Gestión de Trámites</span>
                <i className="pi pi-chevron-down"></i>
                <Ripple />
              </div>
            </StyleClass>
            <ul className="list-none p-0 m-0 overflow-hidden">
              <li>
                <Link
                  to={"../tramite/pendiente"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-file-export mr-2"></i>
                  <span className="font-medium text-sm">Pendientes</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../tramite/recibido"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-book mr-2"></i>
                  <span className="font-medium text-sm">Recibidos</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../tramite/emitido"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-send mr-2"></i>
                  <span className="font-medium text-sm">Emitidos</span>
                  <Ripple />
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="list-none px-2 ">
          <li>
            <StyleClass
              nodeRef={btnRef3}
              selector="@next"
              enterFromClassName="hidden"
              enterActiveClassName="slidedown"
              leaveToClassName="hidden"
              leaveActiveClassName="slideup"
            >
              <div
                ref={btnRef3}
                className="p-ripple p-2 flex align-items-center justify-content-between cursor-pointer text-600 border-round hover:surface-100 transition-duration-150 transition-colors"
              >
                <span className="font-medium">Mantenimiento</span>
                <i className="pi pi-chevron-down"></i>
                <Ripple />
              </div>
            </StyleClass>
            <ul className="list-none p-0 m-0 overflow-hidden">
              <li>
                <Link
                  to={"../mantenimiento/usuario"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Usuario</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/empresa"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Empresa</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/area"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Area</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/cargo"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Cargo</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/estado"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Estado</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/esquema_estado"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Esquema Estado</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/rol"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Rol</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/tipo_documento"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Tipo Documento</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/tipo_usuario"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Tipo Usuario</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/tipo_tramite"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">Tipo Tramite</span>
                  <Ripple />
                </Link>
              </li>
              <li>
                <Link
                  to={"../mantenimiento/tipo_identificacion"}
                  className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full custom"
                >
                  <i className="pi pi-table mr-2"></i>
                  <span className="font-medium text-sm">
                    Tipo Identificacion
                  </span>
                  <Ripple />
                </Link>
              </li>
              {/* <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                  <i className="pi pi-bookmark mr-2"></i>
                  <span className="font-medium">Bookmarks</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <StyleClass
                  nodeRef={btnRef3}
                  selector="@next"
                  enterFromClassName="hidden"
                  enterActiveClassName="slidedown"
                  leaveToClassName="hidden"
                  leaveActiveClassName="slideup"
                >
                  <a
                    ref={btnRef3}
                    className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                  >
                    <i className="pi pi-chart-line mr-2"></i>
                    <span className="font-medium">Reports</span>
                    <i className="pi pi-chevron-down ml-auto mr-1"></i>
                    <Ripple />
                  </a>
                </StyleClass>
                <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                  <li>
                    <StyleClass
                      nodeRef={btnRef4}
                      selector="@next"
                      enterFromClassName="hidden"
                      enterActiveClassName="slidedown"
                      leaveToClassName="hidden"
                      leaveActiveClassName="slideup"
                    >
                      <a
                        ref={btnRef4}
                        className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                      >
                        <i className="pi pi-chart-line mr-2"></i>
                        <span className="font-medium">Revenue</span>
                        <i className="pi pi-chevron-down ml-auto mr-1"></i>
                        <Ripple />
                      </a>
                    </StyleClass>
                    <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-table mr-2"></i>
                          <span className="font-medium">View</span>
                          <Ripple />
                        </a>
                      </li>
                      <li>
                        <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                          <i className="pi pi-search mr-2"></i>
                          <span className="font-medium">Search</span>
                          <Ripple />
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                      <i className="pi pi-chart-line mr-2"></i>
                      <span className="font-medium">Expenses</span>
                      <Ripple />
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                  <i className="pi pi-users mr-2"></i>
                  <span className="font-medium">Team</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                  <i className="pi pi-comments mr-2"></i>
                  <span className="font-medium">Messages</span>
                  <span
                    className="inline-flex align-items-center justify-content-center ml-auto bg-blue-500 text-0 border-circle"
                    style={{
                      minWidth: "1.5rem",
                      height: "1.5rem",
                    }}
                  >
                    3
                  </span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                  <i className="pi pi-calendar mr-2"></i>
                  <span className="font-medium">Calendar</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                  <i className="pi pi-cog mr-2"></i>
                  <span className="font-medium">Settings</span>
                  <Ripple />
                </a>
              </li> */}
            </ul>
          </li>
        </ul>
        {/* <ul className="list-none px-2">
          <li>
            <StyleClass
              nodeRef={btnRef5}
              selector="@next"
              enterFromClassName="hidden"
              enterActiveClassName="slidedown"
              leaveToClassName="hidden"
              leaveActiveClassName="slideup"
            >
              <div
                ref={btnRef5}
                className="p-ripple p-2 flex align-items-center justify-content-between cursor-pointer text-600 border-round hover:surface-100 transition-duration-150 transition-colors"
              >
                <span className="font-medium">APPLICATION</span>
                <i className="pi pi-chevron-down"></i>
                <Ripple />
              </div>
            </StyleClass>
            <ul className="list-none p-0 m-0 hidden overflow-hidden">
              <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                  <i className="pi pi-folder mr-2"></i>
                  <span className="font-medium">Projects</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                  <i className="pi pi-chart-bar mr-2"></i>
                  <span className="font-medium">Performance</span>
                  <Ripple />
                </a>
              </li>
              <li>
                <a className="p-ripple flex align-items-center cursor-pointer p-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                  <i className="pi pi-cog mr-2"></i>
                  <span className="font-medium">Settings</span>
                  <Ripple />
                </a>
              </li>
            </ul>
          </li>
        </ul> */}
      </div>

      {/* Sidebar-footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          boxSizing: "border-box",
          width: "90%",
        }}
      >
        <hr className="border-top-1 border-none surface-border" />
        <a className="my-2 mx-3 flex align-items-center justify-content-center cursor-pointer p-1 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
          <Avatar
            label={`${
              userAuth?.Nombres.split(" ")[0][0].toUpperCase() +
              "" +
              userAuth?.ApellidoPaterno.split(" ")[0][0].toUpperCase()
            }`}
            image={`${userAuth?.UrlFotoPerfil}`}
            shape="circle"
          />
          <span className="font-bold">
            {userAuth?.Nombres.split(" ")[0] +
              " " +
              userAuth?.ApellidoPaterno.split(" ")[0]}
          </span>
        </a>
      </div>
    </Card>
  );
};

export default SideBar;
