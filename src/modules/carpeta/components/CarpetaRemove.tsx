import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CarpetaEntity } from "../interfaces/CarpetaInterface";

type CarpetaRemoveProps = {
  carpeta: CarpetaEntity;
  removeCarpetaDialog: boolean;
  hideRemoveCarpetaDialog: () => void;
  removeCarpeta: () => void;
};

const CarpetaRemove = (props: CarpetaRemoveProps) => {
  const removeCarpetaDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveCarpetaDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeCarpeta}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeCarpetaDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeCarpetaDialogFooter}
      onHide={props.hideRemoveCarpetaDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.carpeta && (
          <span>
            {/* Are you sure you want to remove <b>{props.carpeta.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar esta carpeta <b>{props.carpeta.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default CarpetaRemove;
