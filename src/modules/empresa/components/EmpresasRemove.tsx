import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { EmpresaEntity } from "../interfaces/EmpresaInterface";

type EmpresasRemoveProps = {
  empresa: EmpresaEntity;
  removeEmpresasDialog: boolean;
  hideRemoveEmpresasDialog: () => void;
  removeSelectedEmpresas: () => void;
};

const EmpresaRemove = (props: EmpresasRemoveProps) => {
  const removeEmpresasDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveEmpresasDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedEmpresas}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeEmpresasDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeEmpresasDialogFooter}
      onHide={props.hideRemoveEmpresasDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.empresa && (
          // <span>Are you sure you want to remove the selected empresas?</span>
          <span>¿Estás segura¿o que quieres eliminar las empresas selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default EmpresaRemove;
