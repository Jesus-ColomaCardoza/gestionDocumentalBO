import { Link } from "react-router-dom";
import { useTheme } from "../../../ThemeContext";

import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";

type MenuBarProps = {
  visible?: boolean;
  setVisible: (value: boolean) => void;
};

const MenuBar = (props: MenuBarProps) => {
  const {  switchTheme } = useTheme();

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

  const items: any[] = [
    {
      label: "sidebar",
      command: () => {
        props.setVisible(true);
      },
    },

    {
      label: "Home v1",
      icon: "pi pi-home",
      url: "/dashboard",
    },
    {
      label: "Features",
      icon: "pi pi-star",
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
    <img
      alt="logo"
      src="https://primefaces.org/cdn/primereact/images/logo.png"
      height="40"
      className="mr-2"
    ></img>
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
          className="mr-2"
          onClick={() => switchTheme("lara-dark-blue","dark")}
        ></Button>
        <Button
          icon="pi pi-sun"
          className="mr-2"
          onClick={() => switchTheme("lara-light-blue","light")}
        ></Button>

        <Avatar
          image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
          shape="circle"
        />
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "sticky",
        top:0,
        zIndex: 100,
      }}
    >
      <Menubar
        style={{ height: "3.5rem" }}
        model={items}
        start={start}
        end={end}
      />
    </div>
  );
};

export default MenuBar;
