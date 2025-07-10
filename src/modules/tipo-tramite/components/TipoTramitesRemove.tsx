import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { TipoTramiteEntity } from "../interfaces/TipoTramiteInterface";

type TipoTramitesRemoveProps = {
  tipoTramite: TipoTramiteEntity;
  removeTipoTramitesDialog: boolean;
  hideRemoveTipoTramitesDialog: () => void;
  removeSelectedTipoTramites: () => void;
};

const TipoTramiteRemove = (props: TipoTramitesRemoveProps) => {
  const removeTipoTramitesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveTipoTramitesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedTipoTramites}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeTipoTramitesDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeTipoTramitesDialogFooter}
      onHide={props.hideRemoveTipoTramitesDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.tipoTramite && (
          // <span>Are you sure you want to remove the selected tipoTramites?</span>
          <span>¿Estás segura¿o que quieres eliminar los tipos de tramites selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default TipoTramiteRemove;
