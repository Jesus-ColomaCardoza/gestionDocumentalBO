import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TipoUsuarioEntity } from "../interfaces/TipoUsuarioInterface";

type TipoUsuarioRemoveProps = {
  tipoUsuario: TipoUsuarioEntity;
  removeTipoUsuarioDialog: boolean;
  hideRemoveTipoUsuarioDialog: () => void;
  removeTipoUsuario: () => void;
};

const TipoUsuarioRemove = (props: TipoUsuarioRemoveProps) => {
  const removeTipoUsuarioDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveTipoUsuarioDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeTipoUsuario}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeTipoUsuarioDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeTipoUsuarioDialogFooter}
      onHide={props.hideRemoveTipoUsuarioDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.tipoUsuario && (
          <span>
            {/* Are you sure you want to remove <b>{props.tipoUsuario.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el área <b>{props.tipoUsuario.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default TipoUsuarioRemove;
