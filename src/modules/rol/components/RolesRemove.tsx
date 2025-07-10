import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { RolEntity } from "../interfaces/RolInterface";

type RolesRemoveProps = {
  rol: RolEntity;
  removeRolesDialog: boolean;
  hideRemoveRolesDialog: () => void;
  removeSelectedRoles: () => void;
};

const RolRemove = (props: RolesRemoveProps) => {
  const removeRolesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveRolesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedRoles}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeRolesDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeRolesDialogFooter}
      onHide={props.hideRemoveRolesDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.rol && (
          // <span>Are you sure you want to remove the selected rols?</span>
          <span>¿Estás segura¿o que quieres eliminar los roles selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default RolRemove;
