import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { UsuarioEntity } from "../interfaces/UsuarioInterface";

type UsuarioRemoveProps = {
  usuario: UsuarioEntity;
  removeUsuarioDialog: boolean;
  hideRemoveUsuarioDialog: () => void;
  removeUsuario: () => void;
};

const UsuarioRemove = (props: UsuarioRemoveProps) => {
  const removeUsuarioDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveUsuarioDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeUsuario}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeUsuarioDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeUsuarioDialogFooter}
      onHide={props.hideRemoveUsuarioDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.usuario && (
          <span>
            {/* Are you sure you want to remove <b>{props.usuario.Nombres}</b>? */}
            ¿Estás seguro de que quieres eliminar el usuario <b>{props.usuario.Nombres}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default UsuarioRemove;
