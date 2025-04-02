import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AreaEntity } from "../interfaces/AreaInterface";

type AreasRemoveProps = {
  area: AreaEntity;
  removeAreasDialog: boolean;
  hideRemoveAreasDialog: () => void;
  removeSelectedAreas: () => void;
};

const AreaRemove = (props: AreasRemoveProps) => {
  const removeAreasDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveAreasDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedAreas}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeAreasDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeAreasDialogFooter}
      onHide={props.hideRemoveAreasDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.area && (
          // <span>Are you sure you want to remove the selected areas?</span>
          <span>¿Estás segura¿o que quieres eliminar las áreas selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default AreaRemove;
