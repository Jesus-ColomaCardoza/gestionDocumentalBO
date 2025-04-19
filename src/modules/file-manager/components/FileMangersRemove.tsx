import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileManagerEntity } from "../interfaces/FileMangerInterface";

type FileManagersRemoveProps = {
  fileManager: FileManagerEntity;
  removeFileManagersDialog: boolean;
  hideRemoveFileManagersDialog: () => void;
  removeSelectedFileManagers: () => void;
};

const FileManagersRemove = (props: FileManagersRemoveProps) => {
  const removeFileManagersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveFileManagersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeSelectedFileManagers}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeFileManagersDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeFileManagersDialogFooter}
      onHide={props.hideRemoveFileManagersDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.fileManager && (
          // <span>Are you sure you want to remove the selected fileManagers?</span>
          <span>¿Estás segura¿o que quieres eliminar las áreas selecionadas?</span>
        )}
      </div>
    </Dialog>
  );
};

export default FileManagersRemove;
