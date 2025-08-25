import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Dispatch, SetStateAction } from "react";
import { MovimientoEntity } from "../../movimiento/interfaces/MovimientoInterface";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import { UsuarioEntity } from "../../usuario/interfaces/UsuarioInterface";
import { TramiteEntity } from "../interfaces/TramiteInterface";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

type TramiteArchivarModalProps = {
  submitted: boolean;
  hideTramiteArchivarDialog: () => void;
  tramiteArchivarDialog: boolean;
  // selectedTramiteDestinos: TramiteEntity[];
  // setSelectedTramiteDestinos: Dispatch<SetStateAction<MovimientoEntity[]>>;
};

const TramiteArchivarModal = (props: TramiteArchivarModalProps) => {
  const estadoDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={() => {
          props.hideTramiteArchivarDialog();
        }}
      />
      <Button
        // loading={props.loadingEstadoCreateOrUpdate}
        label="Archivar"
        icon="pi pi-check"
        onClick={() => {}}
      />
    </>
  );

  return (
    <Dialog
      visible={props.tramiteArchivarDialog}
      style={{ width: "40rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Archivar trámite"
      modal
      className="p-fluid"
      footer={estadoDialogFooter}
      onHide={props.hideTramiteArchivarDialog}
    >
      <div className="flex flex-row" style={{ gap: "1rem" }}>
        <div
          style={{
            width: "50%",
          }}
        >
          <label
            htmlFor="CodigoReferencia"
            className="block text-900 text-sm font-medium mb-2"
          >
            Trámite
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                id="CodigoReferencia"
                // value={tramite.CodigoReferencia}
                onChange={(e) => {
                  // onInputTextChange(e, "CodigoReferencia");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.CodigoReferencia && (
              <small className="p-error">
                {tramiteErrors.CodigoReferencia}
              </small>
            )} */}
          </div>
        </div>

        <div
          style={{
            width: "50%",
          }}
        >
          <label
            htmlFor="CodigoReferencia"
            className="block text-900 text-sm font-medium mb-2"
          >
            Documento
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                id="CodigoReferencia"
                // value={tramite.CodigoReferencia}
                onChange={(e) => {
                  // onInputTextChange(e, "CodigoReferencia");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.CodigoReferencia && (
              <small className="p-error">
                {tramiteErrors.CodigoReferencia}
              </small>
            )} */}
          </div>
        </div>
      </div>

      <div className="flex flex-row" style={{ gap: "1rem" }}>
        <div
          style={{
            width: "100%",
          }}
        >
          <label
            htmlFor="AreaEmision"
            className="block text-900 text-sm font-medium mb-2"
          >
            Archivador
          </label>
          <div className="flex flex-column  mb-3 gap-1">
            <div className="p-inputgroup">
              <Dropdown
                // value={tramite.Area}
                onChange={(e) => {
                  // onDropdownChange(e, "Area", "IdArea", "IdAreaEmision");
                }}
                // options={areas}
                optionLabel="Descripcion"
                filter
                // placeholder="Seleccionar Área de Emisión"
                className="w-full flex flex-row align-items-center p-inputtext-sm"
                showClear
                style={{
                  paddingTop: "1.2rem",
                  paddingBottom: "1.2rem",
                  width: "16rem",
                  height: "2rem",
                }}
              />
            </div>
            {/* {tramiteErrors.IdAreaEmision && (
              <small className="p-error">{tramiteErrors.IdAreaEmision}</small>
            )} */}
          </div>
        </div>
      </div>

      <div className="flex flex-row" style={{ gap: "1rem" }}>
        <div
          style={{
            width: "100%",
          }}
        >
          <label
            htmlFor="CodigoReferencia"
            className="block text-900 text-sm font-medium mb-2"
          >
            Detalle
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                id="CodigoReferencia"
                // value={tramite.CodigoReferencia}
                onChange={(e) => {
                  // onInputTextChange(e, "CodigoReferencia");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.CodigoReferencia && (
              <small className="p-error">
                {tramiteErrors.CodigoReferencia}
              </small>
            )} */}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TramiteArchivarModal;
