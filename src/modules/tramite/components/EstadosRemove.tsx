import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { EstadoEntity } from "../../estado/interfaces/EstadoInterface";

type EstadosRemoveProps = {
  estado: EstadoEntity;
  removeEstadosDialog: boolean;
  hideRemoveEstadosDialog: () => void;
  removeSelectedEstados: () => void;
};

const EstadoRemove = (props: EstadosRemoveProps) => {
  const removeEstadosDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveEstadosDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedEstados}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeEstadosDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeEstadosDialogFooter}
      onHide={props.hideRemoveEstadosDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.estado && (
          // <span>Are you sure you want to remove the selected estados?</span>
          <span>¿Estás segura¿o que quieres eliminar las áreas selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default EstadoRemove;
