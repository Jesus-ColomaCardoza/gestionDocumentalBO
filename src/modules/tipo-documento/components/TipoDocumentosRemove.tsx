import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TipoDocumentoEntity } from "../interfaces/TipoDocumentoInterface";

type TipoDocumentosRemoveProps = {
  tipoDocumento: TipoDocumentoEntity;
  removeTipoDocumentosDialog: boolean;
  hideRemoveTipoDocumentosDialog: () => void;
  removeSelectedTipoDocumentos: () => void;
};

const TipoDocumentoRemove = (props: TipoDocumentosRemoveProps) => {
  const removeTipoDocumentosDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveTipoDocumentosDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedTipoDocumentos}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeTipoDocumentosDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeTipoDocumentosDialogFooter}
      onHide={props.hideRemoveTipoDocumentosDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.tipoDocumento && (
          // <span>Are you sure you want to remove the selected tipoDocumentos?</span>
          <span>¿Estás segura¿o que quieres eliminar las áreas selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default TipoDocumentoRemove;
