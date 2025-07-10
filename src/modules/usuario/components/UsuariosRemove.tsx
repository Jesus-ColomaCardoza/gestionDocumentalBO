import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { UsuarioEntity } from "../interfaces/UsuarioInterface";

type UsuariosRemoveProps = {
  usuario: UsuarioEntity;
  removeUsuariosDialog: boolean;
  hideRemoveUsuariosDialog: () => void;
  removeSelectedUsuarios: () => void;
};

const UsuarioRemove = (props: UsuariosRemoveProps) => {
  const removeUsuariosDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveUsuariosDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedUsuarios}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeUsuariosDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeUsuariosDialogFooter}
      onHide={props.hideRemoveUsuariosDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.usuario && (
          // <span>Are you sure you want to remove the selected usuarios?</span>
          <span>¿Estás segura¿o que quieres eliminar los usuarios selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default UsuarioRemove;
