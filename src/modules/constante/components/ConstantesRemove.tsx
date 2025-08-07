import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ConstanteEntity } from "../interfaces/ConstanteInterface";

type ConstantesRemoveProps = {
  constante: ConstanteEntity;
  removeConstantesDialog: boolean;
  hideRemoveConstantesDialog: () => void;
  removeSelectedConstantes: () => void;
};

const ConstanteRemove = (props: ConstantesRemoveProps) => {
  const removeConstantesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveConstantesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedConstantes}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeConstantesDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeConstantesDialogFooter}
      onHide={props.hideRemoveConstantesDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.constante && (
          // <span>Are you sure you want to remove the selected constantes?</span>
          <span>¿Estás segura¿o que quieres eliminar los constantes selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default ConstanteRemove;
