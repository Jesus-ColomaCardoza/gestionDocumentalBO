import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { RolEntity } from "../interfaces/RolInterface";

type RolRemoveProps = {
  rol: RolEntity;
  removeRolDialog: boolean;
  hideRemoveRolDialog: () => void;
  removeRol: () => void;
};

const RolRemove = (props: RolRemoveProps) => {
  const removeRolDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveRolDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeRol}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeRolDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeRolDialogFooter}
      onHide={props.hideRemoveRolDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.rol && (
          <span>
            {/* Are you sure you want to remove <b>{props.rol.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el área <b>{props.rol.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default RolRemove;
