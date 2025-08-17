import { Card } from "primereact/card";
import { useRef } from "react";
import { Outlet } from "react-router-dom";

type MainContainerProps = {
  visible?: boolean;
};

const MainContainer = ({ visible }: MainContainerProps) => {
  const refMainContainer = useRef<Card>(null);

  return (
    <Card
      ref={refMainContainer}
      style={{
        backgroundColor: "var(--surface-50)",
        width: visible ? "calc(100% - 20rem)" : "calc(100% - 2rem)",
        margin: "1rem",
        minHeight: "calc(100vh - 6rem)",
        transition: ".5s width ease-in-out",
      }}
    >
      <Outlet />
    </Card>
  );
};

export default MainContainer;
