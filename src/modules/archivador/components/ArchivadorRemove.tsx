import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ArchivadorEntity } from "../interfaces/ArchivadorInterface";


type ArchivadorRemoveProps = {
  archivado: ArchivadorEntity;
  removeArchivadorDialog: boolean;
  hideRemoveArchivadorDialog: () => void;
  removeArchivador: () => void;
};

const ArchivadorRemove = (props: ArchivadorRemoveProps) => {
  const removeArchivadoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveArchivadorDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeArchivador}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeArchivadorDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeArchivadoDialogFooter}
      onHide={props.hideRemoveArchivadorDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.archivado && (
          <span>
            {/* Are you sure you want to remove <b>{props.archivado.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el Archivado <b>{props.archivado.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default ArchivadorRemove;
