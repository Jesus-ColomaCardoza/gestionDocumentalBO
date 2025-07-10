import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { EmpresaEntity } from "../interfaces/EmpresaInterface";

type EmpresaRemoveProps = {
  empresa: EmpresaEntity;
  removeEmpresaDialog: boolean;
  hideRemoveEmpresaDialog: () => void;
  removeEmpresa: () => void;
};

const EmpresaRemove = (props: EmpresaRemoveProps) => {
  const removeEmpresaDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveEmpresaDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeEmpresa}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeEmpresaDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeEmpresaDialogFooter}
      onHide={props.hideRemoveEmpresaDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.empresa && (
          <span>
            {/* Are you sure you want to remove <b>{props.empresa.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar esta empresa <b>{props.empresa.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default EmpresaRemove;
