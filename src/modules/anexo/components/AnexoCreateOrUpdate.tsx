import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AnexoEntity } from "../interfaces/AnexoInterface";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";
import { Tooltip } from "primereact/tooltip";
import {
  FileUpload,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  FileUploadUploadEvent,
  ItemTemplateOptions,
} from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Dispatch, SetStateAction, useRef } from "react";

type AnexoCreateOrUpdateProps = {
  submitted: boolean;
  anexo: AnexoEntity;
  anexoDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createAnexo: () => void;
  updateAnexo: () => void;
  onInputTextAreaChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => void;
  onSwitchChange: (e: InputSwitchChangeEvent) => void;
  loadingAnexoCreateOrUpdate: boolean;
  selectedFilesUpload: File[];
  setSelectedFilesUpload: Dispatch<SetStateAction<File[]>>;
  totalSizeFilesUpload: number;
  setTotalSizeFilesUpload: Dispatch<SetStateAction<number>>;
};

const AnexoCreateOrUpdate = (props: AnexoCreateOrUpdateProps) => {
  const fileUpload = useRef<FileUpload>(null);

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    // console.log(e.files[0]);
    props.setSelectedFilesUpload((prev) => [...prev, ...e.files]);
    props.setTotalSizeFilesUpload(e.files[0].size);
  };

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    let _totalSize = 0;
    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });
    props.setTotalSizeFilesUpload(0);
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    props.setSelectedFilesUpload((prev) =>
      prev.filter((f) => f.name !== file.name)
    );
    props.setTotalSizeFilesUpload(props.totalSizeFilesUpload - file.size);
    callback();
  };

  const onTemplateClear = () => {
    props.setTotalSizeFilesUpload(0);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const {
      className,
      chooseButton,
      // uploadButton,
      cancelButton,
    } = options;
    const value = props.totalSizeFilesUpload / 20000;
    const formatedValue =
      fileUpload && fileUpload.current
        ? fileUpload.current.formatSize(props.totalSizeFilesUpload)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {/* {uploadButton} */}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 2 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File;
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "70%" }}>
          {file.type == "application/pdf" ? (
            <i
              className="pi pi-file-pdf"
              style={{ color: "#e55", fontSize: "2rem" }}
            ></i>
          ) : (
            <img
              alt={file.name}
              role="presentation"
              src={URL.createObjectURL(file)}
              width={100}
            />
          )}
          <span className="flex flex-column text-left mx-3">
            <a
              className="hover:underline hover:text-red-300"
              style={{ textDecoration: "none", color: "var(--text-color)" }}
              href={URL.createObjectURL(file)}
              target="_blank"
            >
              {file.name}
            </a>

            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
          style={{ width: "2rem", height: "2rem" }}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image p-3"
          style={{
            fontSize: "2em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span style={{ fontSize: "1em", color: "var(--text-color-secondary)" }}>
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const anexoDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={props.hideDialog}
      />
      <Button
        loading={props.loadingAnexoCreateOrUpdate}
        label="Aceptar"
        icon="pi pi-check"
        onClick={
          props.anexoDialog.type == "create"
            ? props.createAnexo
            : props.updateAnexo
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.anexoDialog.state}
      style={{ width: "40rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Anexo"
      modal
      className="p-fluid"
      footer={anexoDialogFooter}
      onHide={props.hideDialog}
    >


     {/* interfaz de documento */}
    </Dialog>
  );
};

export default AnexoCreateOrUpdate;
