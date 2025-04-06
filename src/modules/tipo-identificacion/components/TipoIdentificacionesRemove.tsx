import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TipoIdentificacionEntity } from "../interfaces/TipoIdentificacionInterface";


type TipoIdentificacionesRemoveProps = {
  tipoIdentificacion: TipoIdentificacionEntity;
  removeTipoIdentificacionesDialog: boolean;
  hideRemoveTipoIdentificacionesDialog: () => void;
  removeSelectedTipoIdentificaciones: () => void;
};

const TipoIdentificacionRemove = (props: TipoIdentificacionesRemoveProps) => {
  const removeTipoIdentificacionesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveTipoIdentificacionesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedTipoIdentificaciones}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeTipoIdentificacionesDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeTipoIdentificacionesDialogFooter}
      onHide={props.hideRemoveTipoIdentificacionesDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.tipoIdentificacion && (
          // <span>Are you sure you want to remove the selected tipoIdentificaciones?</span>
          <span>¿Estás segura¿o que quieres eliminar las áreas selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default TipoIdentificacionRemove;
