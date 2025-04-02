import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AreaEntity } from "../interfaces/AreaInterface";

type AreaRemoveProps = {
  area: AreaEntity;
  removeAreaDialog: boolean;
  hideRemoveAreaDialog: () => void;
  removeArea: () => void;
};

const AreaRemove = (props: AreaRemoveProps) => {
  const removeAreaDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveAreaDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeArea}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeAreaDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeAreaDialogFooter}
      onHide={props.hideRemoveAreaDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.area && (
          <span>
            {/* Are you sure you want to remove <b>{props.area.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el área <b>{props.area.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default AreaRemove;
