import { Link } from "react-router-dom";
import { useTheme } from "../../../ThemeContext";
import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useAuth } from "../../auth/context/AuthContext";
import { useEffect } from "react";

type MenuBarProps = {
  visible?: boolean;
  setVisible: (value: boolean) => void;
};

const MenuBar = (props: MenuBarProps) => {
  const { themePrimeFlex, switchTheme } = useTheme();

  const { logout } = useAuth()!;

  const itemRenderer = (item: any) => (
    <Link
      className={`flex align-items-center p-menuitem-link p-2 ${
        themePrimeFlex === "light" ? "text-white hover:text-900" : ""
      } `}
      to={"/dashboard"}
    >
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span
          className="ml-auto border-1  text-xs "
          style={{ borderRadius: "5px", borderColor: "#555" }}
        >
          {item.shortcut}
        </span>
      )}
    </Link>
  );

  const itemRenderer2 = (item: any) => (
    <div
      className={`flex align-items-center p-menuitem-link px-2 py-2  ${
        themePrimeFlex === "light" ? "text-white hover:text-900" : ""
      } `} // style={{
      //   marginLeft:"14rem"
      // }}
    >
      <span className={item.icon} />
    </div>
  );



  const itemRenderer3 = (item: any) => (
    <div
      className={`flex align-items-center  p-menuitem-link px-3 py-2  ${
        themePrimeFlex === "light" ? "text-white hover:text-900 " : ""
      } `}
    >
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
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
      url: "dashboard",
      template: itemRenderer3,
    },
    {
      label: "Exit",
      icon: "pi pi-sign-out",
      command: () => {
        logout();
      },
      template: itemRenderer3,
    },
    // {
    //   label: "Projects",
    //   icon: "pi pi-search",
    //   template: itemRenderer3,
    //   items: [
    //     {
    //       label: "Core",
    //       icon: "pi pi-bolt",
    //       shortcut: "⌘+S",
    //       template: itemRenderer,
    //     },
    //     {
    //       label: "Blocks",
    //       icon: "pi pi-server",
    //       shortcut: "⌘+B",
    //       template: itemRenderer,
    //     },
    //     {
    //       label: "UI Kit",
    //       icon: "pi pi-pencil",
    //       shortcut: "⌘+U",
    //       template: itemRenderer,
    //     },
    //     {
    //       separator: true,
    //     },
    //     {
    //       label: "Templates",
    //       icon: "pi pi-palette",
    //       items: [
    //         {
    //           label: "Apollo",
    //           icon: "pi pi-palette",
    //           badge: 2,
    //           template: itemRenderer,
    //         },
    //         {
    //           label: "Ultima",
    //           icon: "pi pi-palette",
    //           badge: 3,
    //           template: itemRenderer,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   label: "Home v2",
    //   icon: "pi pi-envelope",
    //   badge: 6,
    //   template: itemRenderer,
    // },
  ];

  const start = (
    <div className="flex align-items-center" style={{ width: "16.7rem" }}>
      <img
        alt="logo"
        src="https://us.123rf.com/450wm/breizhatao/breizhatao2303/breizhatao230300075/200640330-flag-of-peru-painted-on-a-cinder-block-wall.jpg?ver=6"
        // src="https://images.teepublic.com/derived/production/designs/15223072_0/1603168989/i_p:c_000000,s_630,q_90.jpg"
        // src="https://res.cloudinary.com/teepublic/image/private/s--Tt6RHArX--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_000000,e_outline:48/co_000000,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_auto:good:420,w_630/v1603168989/production/designs/15223072_0.jpg"
        height="40"
        className="ml-2"
        style={{ borderRadius: "100%", width: "2rem", height: "2rem" }}
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
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
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
          severity="contrast"
          onClick={() => switchTheme("lara-dark-blue", "dark")}
          style={{
            width: "2em",
            height: "1em",
          }}
        ></Button>
        <Button
          icon="pi pi-sun"
          className="mr-2"
          severity="contrast"
          onClick={() => switchTheme("lara-light-blue", "light")}
          style={{
            width: "2em",
            height: "1em",
          }}
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
          backgroundColor:
            themePrimeFlex === "dark" ? "var(--surface-50)" : "#D63939",
          // backgroundColor: "var(--surface-50)",
          borderColor:
            themePrimeFlex === "dark" ? "var(--surface-50)" : "#D63939",
          borderRadius: 0,
        }}
        model={items}
        start={start}
        end={end}
      />
    </div>
  );
};

export default MenuBar;
