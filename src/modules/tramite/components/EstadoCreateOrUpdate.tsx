import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { EsquemaEstadoEntity } from "../../esquema-estado/interfaces/EsquemaEstadoInterface";
import { EstadoEntity } from "../../estado/interfaces/EstadoInterface";

type EstadoCreateOrUpdateProps = {
  submitted: boolean;
  estado: EstadoEntity;
  esquemaEstados:  Pick<EsquemaEstadoEntity, "IdEsquemaEstado" | "Descripcion">[];
  estadoDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createEstado: () => void;
  updateEstado: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  onDropdownChange: (
    e: DropdownChangeEvent,
    nameFK: string,
    nameObj: string
  ) => void;
  onActivoChange: (e: RadioButtonChangeEvent) => void;
  loadingEstadoCreateOrUpdate: boolean;
};

const EstadoCreateOrUpdate = (props: EstadoCreateOrUpdateProps) => {
  const estadoDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={() => {
          props.hideDialog();
        }}
      />
      <Button
        loading={props.loadingEstadoCreateOrUpdate}
        label="Aceptar"
        icon="pi pi-check"
        onClick={
          props.estadoDialog.type == "create"
            ? props.createEstado
            : props.updateEstado
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.estadoDialog.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Área Detalles"
      modal
      className="p-fluid"
      footer={estadoDialogFooter}
      onHide={props.hideDialog}
    >
    
      
    </Dialog>
  );
};

export default EstadoCreateOrUpdate;
