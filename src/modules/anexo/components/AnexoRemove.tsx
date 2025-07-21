import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AnexoEntity } from "../interfaces/AnexoInterface";

type AnexoRemoveProps = {
  anexo: AnexoEntity;
  removeAnexoDialog: boolean;
  hideRemoveAnexoDialog: () => void;
  removeAnexo: () => void;
};

const AnexoRemove = (props: AnexoRemoveProps) => {
  const removeAnexoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveAnexoDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeAnexo}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeAnexoDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeAnexoDialogFooter}
      onHide={props.hideRemoveAnexoDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.anexo && (
          <span>
            {/* Are you sure you want to remove <b>{props.anexo.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar este anexo <b>{props.anexo.Titulo}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default AnexoRemove;
