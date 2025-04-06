import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { EsquemaEstadoEntity } from "../interfaces/EsquemaEstadoInterface";

type EsquemaEstadoRemoveProps = {
  esquemaEstado: EsquemaEstadoEntity;
  removeEsquemaEstadoDialog: boolean;
  hideRemoveEsquemaEstadoDialog: () => void;
  removeEsquemaEstado: () => void;
};

const EsquemaEstadoRemove = (props: EsquemaEstadoRemoveProps) => {
  const removeEsquemaEstadoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveEsquemaEstadoDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeEsquemaEstado}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeEsquemaEstadoDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeEsquemaEstadoDialogFooter}
      onHide={props.hideRemoveEsquemaEstadoDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.esquemaEstado && (
          <span>
            {/* Are you sure you want to remove <b>{props.esquemaEstado.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el área <b>{props.esquemaEstado.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default EsquemaEstadoRemove;
