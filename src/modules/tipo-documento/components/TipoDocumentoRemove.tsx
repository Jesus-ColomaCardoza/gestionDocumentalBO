import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TipoDocumentoEntity } from "../interfaces/TipoDocumentoInterface";

type TipoDocumentoRemoveProps = {
  tipoDocumento: TipoDocumentoEntity;
  removeTipoDocumentoDialog: boolean;
  hideRemoveTipoDocumentoDialog: () => void;
  removeTipoDocumento: () => void;
};

const TipoDocumentoRemove = (props: TipoDocumentoRemoveProps) => {
  const removeTipoDocumentoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveTipoDocumentoDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeTipoDocumento}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeTipoDocumentoDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeTipoDocumentoDialogFooter}
      onHide={props.hideRemoveTipoDocumentoDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.tipoDocumento && (
          <span>
            {/* Are you sure you want to remove <b>{props.tipoDocumento.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el Tipo de Documento <b>{props.tipoDocumento.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default TipoDocumentoRemove;
