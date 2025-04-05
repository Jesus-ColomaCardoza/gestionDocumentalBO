import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TipoTramiteEntity } from "../interfaces/TipoTramiteInterface";

type TipoTramiteRemoveProps = {
  tipoTramite: TipoTramiteEntity;
  removeTipoTramiteDialog: boolean;
  hideRemoveTipoTramiteDialog: () => void;
  removeTipoTramite: () => void;
};

const TipoTramiteRemove = (props: TipoTramiteRemoveProps) => {
  const removeTipoTramiteDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveTipoTramiteDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeTipoTramite}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeTipoTramiteDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeTipoTramiteDialogFooter}
      onHide={props.hideRemoveTipoTramiteDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.tipoTramite && (
          <span>
            {/* Are you sure you want to remove <b>{props.tipoTramite.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el área <b>{props.tipoTramite.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default TipoTramiteRemove;
