import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { MovimientoEntity } from "../interfaces/MovimientoInterface";

type MovimientoRemoveProps = {
  movimiento: MovimientoEntity;
  removeMovimientoDialog: boolean;
  hideRemoveMovimientoDialog: () => void;
  removeMovimiento: () => void;
};

const MovimientoRemove = (props: MovimientoRemoveProps) => {
  const removeMovimientoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveMovimientoDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeMovimiento}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeMovimientoDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeMovimientoDialogFooter}
      onHide={props.hideRemoveMovimientoDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.movimiento && (
          <span>
            {/* Are you sure you want to remove <b>{props.movimiento.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar este movimiento <b>{props.movimiento.IdMovimiento}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default MovimientoRemove;
