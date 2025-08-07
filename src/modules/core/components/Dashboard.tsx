import { useState } from "react";
import "./../styles/Dashboard.css";
import MenuBar from "./MenuBar";
import SideBar from "./SideBar";
import MainContainer from "./MainContainer";

const Dashboard = () => {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column"}}>
        <MenuBar setVisible={setVisible} />
        <div
          style={{
            display: "flex",
            zIndex: 10,
            margin: 0,
            padding: 0,
          }}
        >
          <SideBar visible={visible} setVisible={setVisible} />
          <MainContainer visible={visible} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
