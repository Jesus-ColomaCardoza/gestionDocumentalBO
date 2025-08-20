import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ArchivadorEntity } from "../interfaces/ArchivadorInterface";

type ArchivadoresRemoveProps = {
  archivador: ArchivadorEntity;
  removeArchivadoresDialog: boolean;
  hideRemoveArchivadoresDialog: () => void;
  removeSelectedArchivadores: () => void;
};

const ArchivadoresRemove = (props: ArchivadoresRemoveProps) => {
  const removeArchivadoresDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveArchivadoresDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedArchivadores}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeArchivadoresDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeArchivadoresDialogFooter}
      onHide={props.hideRemoveArchivadoresDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.archivador && (
          // <span>Are you sure you want to remove the selected cargos?</span>
          <span>¿Estás segura¿o que quieres eliminar los cargos selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default ArchivadoresRemove;
