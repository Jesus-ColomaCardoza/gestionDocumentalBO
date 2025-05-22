import { Link } from "react-router-dom";
import { useTheme } from "../../../ThemeContext";

import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useAuth } from "../../auth/context/AuthContext";

type MenuBarProps = {
  visible?: boolean;
  setVisible: (value: boolean) => void;
};

const MenuBar = (props: MenuBarProps) => {
  const { switchTheme } = useTheme();

  const {logout} = useAuth()!;

  const itemRenderer = (item: any) => (
    <Link className="flex align-items-center p-menuitem-link" to={"/dashboard"}>
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span
          className="ml-auto border-1  text-xs p-1"
          style={{ borderRadius: "5px", borderColor: "#555" }}
        >
          {item.shortcut}
        </span>
      )}
    </Link>
  );

  const itemRenderer2 = (item: any) => (
    <div
      className="flex align-items-center p-menuitem-link p-2"
      // style={{
      //   marginLeft:"14rem"
      // }}
    >
      <span className={item.icon} />
    </div>
  );

  const items: any[] = [
    {
      // label: "Opciones",
      icon: "pi pi-angle-double-right",
      command: () => {
        props.setVisible(true);
      },
      template: itemRenderer2,
    },

    {
      label: "Login",
      icon: "pi pi-home",
      url: "/auth/login",
    },
    {
      label: "Exit",
      icon: "pi pi-sign-out",
      command: () => {
        logout();
      },
    },
    {
      label: "Projects",
      icon: "pi pi-search",
      items: [
        {
          label: "Core",
          icon: "pi pi-bolt",
          shortcut: "⌘+S",
          template: itemRenderer,
        },
        {
          label: "Blocks",
          icon: "pi pi-server",
          shortcut: "⌘+B",
          template: itemRenderer,
        },
        {
          label: "UI Kit",
          icon: "pi pi-pencil",
          shortcut: "⌘+U",
          template: itemRenderer,
        },
        {
          separator: true,
        },
        {
          label: "Templates",
          icon: "pi pi-palette",
          items: [
            {
              label: "Apollo",
              icon: "pi pi-palette",
              badge: 2,
              template: itemRenderer,
            },
            {
              label: "Ultima",
              icon: "pi pi-palette",
              badge: 3,
              template: itemRenderer,
            },
          ],
        },
      ],
    },
    {
      label: "Home v2",
      icon: "pi pi-envelope",
      badge: 6,
      template: itemRenderer,
    },
  ];

  const start = (
    <div className="flex align-items-center" style={{ width: "16.7rem" }}>
      <img
        alt="logo"
        src="https://primefaces.org/cdn/primereact/images/logo.png"
        height="40"
        className="mr-2"
      />
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      {/* <InputText
        placeholder="Search"
        type="text"
        className="w-8rem sm:w-auto"
      />
     */}

      <div
        className="p-card"
        style={{
          display: "flex",
          justifyContent: "end",
          height: "3rem",
          padding: ".5rem",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Button
          icon="pi pi-moon"
          className="mr-2 text-white"
          severity="secondary"
          onClick={() => switchTheme("lara-dark-blue", "dark")}
        ></Button>
        <Button
          icon="pi pi-sun"
          className="mr-2 text-white"
          severity="secondary"
          onClick={() => switchTheme("lara-light-blue", "light")}
        ></Button>

        {/* <Avatar
          image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
          shape="circle"
        /> */}
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Menubar
        style={{
          height: "3.5rem",
          backgroundColor: "var(--surface-50)",
          borderColor: "var(--surface-50)",
        }}
        model={items}
        start={start}
        end={end}
      />
    </div>
  );
};

export default MenuBar;
