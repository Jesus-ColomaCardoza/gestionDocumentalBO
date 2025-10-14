import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { EstadoEntity } from "../../estado/interfaces/EstadoInterface";

type EstadoRemoveProps = {
  estado: EstadoEntity;
  removeEstadoDialog: boolean;
  hideRemoveEstadoDialog: () => void;
  removeEstado: () => void;
};

const EstadoRemove = (props: EstadoRemoveProps) => {
  const removeEstadoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveEstadoDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeEstado}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeEstadoDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeEstadoDialogFooter}
      onHide={props.hideRemoveEstadoDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.estado && (
          <span>
            {/* Are you sure you want to remove <b>{props.estado.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el área <b>{props.estado.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default EstadoRemove;
