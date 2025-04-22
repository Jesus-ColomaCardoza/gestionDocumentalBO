import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DocumentoEntity } from "../interfaces/DocumentoInterface";
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

type DocumentoCreateOrUpdateProps = {
  submitted: boolean;
  documento: DocumentoEntity;
  documentoDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createDocumento: () => void;
  updateDocumento: () => void;
  onInputTextAreaChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => void;
  onSwitchChange: (e: InputSwitchChangeEvent) => void;
  loadingDocumentoCreateOrUpdate: boolean;
  selectedFilesUpload: File[];
  setSelectedFilesUpload: Dispatch<SetStateAction<File[]>>;
  totalSizeFilesUpload: number;
  setTotalSizeFilesUpload: Dispatch<SetStateAction<number>>;
};

const DocumentoCreateOrUpdate = (props: DocumentoCreateOrUpdateProps) => {
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

  const documentoDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={props.hideDialog}
      />
      <Button
        loading={props.loadingDocumentoCreateOrUpdate}
        label="Save"
        icon="pi pi-check"
        onClick={
          props.documentoDialog.type == "create"
            ? props.createDocumento
            : props.updateDocumento
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.documentoDialog.state}
      style={{ width: "40rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Documento"
      modal
      className="p-fluid"
      footer={documentoDialogFooter}
      onHide={props.hideDialog}
    >
      <div className="field">
        <div className="flex align-items-center gap-2">
          <InputSwitch
            id="FirmaDigital"
            checked={props.documento.FirmaDigital ?? false}
            onChange={(e) => props.onSwitchChange(e)}
            className="h-2"
          />
          <label htmlFor="FirmaDigital" className="font-bold m-0">
            PARA FIRMA DIGITAL
          </label>
        </div>
        <p className="m-0 text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem, maxime
          sunt distinctio veniam similique fuga blanditiis repellendus accusamus
        </p>
      </div>

      <div className="field">
        <label htmlFor="Descripcion" className="font-bold">
          Descripción
        </label>
        <InputTextarea
          id="Descripcion"
          value={props.documento.Descripcion}
          onChange={(e) => props.onInputTextAreaChange(e, "Descripcion")}
          autoFocus
          rows={3}
          // className={classNames({
          //   "p-invalid": props.submitted && !props.documento.Descripcion,
          // })}
        />
        {/* {props.submitted && !props.documento.Descripcion && (
          <small className="p-error">Name is required.</small>
        )} */}
      </div>

      <div className="field">
        <Tooltip
          target=".custom-choose-btn"
          content="Choose"
          position="bottom"
        />
        {/* <Tooltip
          target=".custom-upload-btn"
          content="Upload"
          position="bottom"
        /> */}
        <Tooltip
          target=".custom-cancel-btn"
          content="Clear"
          position="bottom"
        />
        <FileUpload
          ref={fileUpload}
          name="file"
          // url="http://localhost:5000/file/create"
          accept="application/pdf"
          style={{
            border: `${
              props.submitted && props.selectedFilesUpload.length == 0
                ? "1px solid #fca5a5"
                : "none"
            } `,
          }}
          maxFileSize={2000000}
          onUpload={onTemplateUpload}
          onSelect={onTemplateSelect}
          onError={onTemplateClear}
          onClear={onTemplateClear}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          chooseOptions={{
            icon: "pi pi-fw pi-images",
            iconOnly: true,
            className: "custom-choose-btn p-button-rounded p-button-outlined",
            style: {
              width: "2rem",
              height: "2rem",
            },
          }}
          uploadOptions={{
            icon: "pi pi-fw pi-cloud-upload",
            iconOnly: true,
            className:
              "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
            style: {
              width: "2rem",
              height: "2rem",
            },
          }}
          cancelOptions={{
            icon: "pi pi-fw pi-times",
            iconOnly: true,
            className:
              "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
            style: {
              width: "2rem",
              height: "2rem",
            },
          }}
        />
        {props.submitted && props.selectedFilesUpload.length == 0 && (
          <small className="p-error">File is required.</small>
        )}
      </div>
    </Dialog>
  );
};

export default DocumentoCreateOrUpdate;
