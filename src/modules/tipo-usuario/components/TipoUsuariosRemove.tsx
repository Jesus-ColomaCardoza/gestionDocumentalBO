import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TipoUsuarioEntity } from "../interfaces/TipoUsuarioInterface";

type TipoUsuariosRemoveProps = {
  tipoUsuario: TipoUsuarioEntity;
  removeTipoUsuariosDialog: boolean;
  hideRemoveTipoUsuariosDialog: () => void;
  removeSelectedTipoUsuarios: () => void;
};

const TipoUsuarioRemove = (props: TipoUsuariosRemoveProps) => {
  const removeTipoUsuariosDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveTipoUsuariosDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedTipoUsuarios}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeTipoUsuariosDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeTipoUsuariosDialogFooter}
      onHide={props.hideRemoveTipoUsuariosDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.tipoUsuario && (
          // <span>Are you sure you want to remove the selected tipoUsuarios?</span>
          <span>¿Estás segura¿o que quieres eliminar las áreas selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default TipoUsuarioRemove;
