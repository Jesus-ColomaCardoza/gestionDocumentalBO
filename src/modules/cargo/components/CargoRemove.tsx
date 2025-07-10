import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CargoEntity } from "../interfaces/CargoInterface";

type CargoRemoveProps = {
  cargo: CargoEntity;
  removeCargoDialog: boolean;
  hideRemoveCargoDialog: () => void;
  removeCargo: () => void;
};

const CargoRemove = (props: CargoRemoveProps) => {
  const removeCargoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveCargoDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeCargo}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeCargoDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeCargoDialogFooter}
      onHide={props.hideRemoveCargoDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.cargo && (
          <span>
            {/* Are you sure you want to remove <b>{props.cargo.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el Cargo <b>{props.cargo.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default CargoRemove;
