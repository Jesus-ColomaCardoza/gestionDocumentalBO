import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { EsquemaEstadoEntity } from "../interfaces/EsquemaEstadoInterface";

type EsquemaEstadosRemoveProps = {
  esquemaEstado: EsquemaEstadoEntity;
  removeEsquemaEstadosDialog: boolean;
  hideRemoveEsquemaEstadosDialog: () => void;
  removeSelectedEsquemaEstados: () => void;
};

const EsquemaEstadoRemove = (props: EsquemaEstadosRemoveProps) => {
  const removeEsquemaEstadosDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveEsquemaEstadosDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedEsquemaEstados}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeEsquemaEstadosDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeEsquemaEstadosDialogFooter}
      onHide={props.hideRemoveEsquemaEstadosDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.esquemaEstado && (
          // <span>Are you sure you want to remove the selected esquemaEstados?</span>
          <span>¿Estás segura¿o que quieres eliminar las áreas selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default EsquemaEstadoRemove;
