type emptyMessageDataProps = {
  loading: boolean;
};

const EmptyMessageData = (props: emptyMessageDataProps) => {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {props.loading ? (
        <p>
          {"Cargando registros "}
          <i className="pi pi-spin pi-spinner-dotted mr-2"></i>
        </p>
      ) : (
        <p>No hay registros</p>
      )}
    </div>
  );
};

export default EmptyMessageData;
