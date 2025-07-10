import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { CargoEntity } from "../interfaces/CargoInterface";

type CargosRemoveProps = {
  cargo: CargoEntity;
  removeCargosDialog: boolean;
  hideRemoveCargosDialog: () => void;
  removeSelectedCargos: () => void;
};

const CargoRemove = (props: CargosRemoveProps) => {
  const removeCargosDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveCargosDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedCargos}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeCargosDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeCargosDialogFooter}
      onHide={props.hideRemoveCargosDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.cargo && (
          // <span>Are you sure you want to remove the selected cargos?</span>
          <span>¿Estás segura¿o que quieres eliminar los cargos selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default CargoRemove;
