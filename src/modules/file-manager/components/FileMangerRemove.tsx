import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileManagerEntity } from "../interfaces/FileMangerInterface";

type FileManagerRemoveProps = {
  fileManager: FileManagerEntity;
  removeFileManagerDialog: boolean;
  hideRemoveFileManagerDialog: () => void;
  removeFileManager: () => void;
};

const FileManagerRemove = (props: FileManagerRemoveProps) => {
  const removeFileManagerDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={props.hideRemoveFileManagerDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={props.removeFileManager}
      />
    </>
  );

  return (
    <Dialog
      visible={props.removeFileManagerDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmación"
      modal
      footer={removeFileManagerDialogFooter}
      onHide={props.hideRemoveFileManagerDialog}
    >
      <div className="flex confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        {props.fileManager && (
          <span>
            {/* Are you sure you want to remove <b>{props.fileManager.Descripcion}</b>? */}
            ¿Estás seguro de que quieres eliminar el área <b>{props.fileManager.Descripcion}</b>?
          </span>
        )}
      </div>
    </Dialog>
  );
};

export default FileManagerRemove;
