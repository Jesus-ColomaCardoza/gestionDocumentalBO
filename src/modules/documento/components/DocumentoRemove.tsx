import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DocumentoEntity } from "../interfaces/DocumentoInterface";

type DocumentoRemoveProps = {
  documento: DocumentoEntity;
  removeDocumentoDialog: boolean;
  hideRemoveDocumentoDialog: () => void;
  removeDocumento: () => void;
};

const DocumentoRemove = (props: DocumentoRemoveProps) => {
  const removeDocumentoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveDocumentoDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeDocumento}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeDocumentoDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeDocumentoDialogFooter}
      onHide={props.hideRemoveDocumentoDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.documento && (
          <span>
            {/* Are you sure you want to remove <b>{props.documento.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar este documento <b>{props.documento.Titulo}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default DocumentoRemove;
