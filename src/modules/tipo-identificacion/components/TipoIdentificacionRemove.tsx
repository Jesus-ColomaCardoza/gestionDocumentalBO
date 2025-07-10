import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TipoIdentificacionEntity } from "../interfaces/TipoIdentificacionInterface";


type TipoIdentificacionRemoveProps = {
  tipoIdentificacion: TipoIdentificacionEntity;
  removeTipoIdentificacionDialog: boolean;
  hideRemoveTipoIdentificacionDialog: () => void;
  removeTipoIdentificacion: () => void;
};

const TipoIdentificacionRemove = (props: TipoIdentificacionRemoveProps) => {
  const removeTipoIdentificacionDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveTipoIdentificacionDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeTipoIdentificacion}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeTipoIdentificacionDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeTipoIdentificacionDialogFooter}
      onHide={props.hideRemoveTipoIdentificacionDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.tipoIdentificacion && (
          <span>
            {/* Are you sure you want to remove <b>{props.tipoIdentificacion.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el tipo de identificacion <b>{props.tipoIdentificacion.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default TipoIdentificacionRemove;
