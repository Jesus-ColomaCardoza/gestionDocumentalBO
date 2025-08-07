import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ConstanteEntity } from "../interfaces/ConstanteInterface";

type ConstanteRemoveProps = {
  constante: ConstanteEntity;
  removeConstanteDialog: boolean;
  hideRemoveConstanteDialog: () => void;
  removeConstante: () => void;
};

const ConstanteRemove = (props: ConstanteRemoveProps) => {
  const removeConstanteDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveConstanteDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeConstante}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeConstanteDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeConstanteDialogFooter}
      onHide={props.hideRemoveConstanteDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.constante && (
          <span>
            {/* Are you sure you want to remove <b>{props.constante.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el Constante <b>{props.constante.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default ConstanteRemove;
