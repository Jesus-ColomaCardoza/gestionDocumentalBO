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

type TramiteDetailsModalProps = {
  submitted: boolean;
  hideTramiteDetailsDialog: () => void;
  tramiteDetailsDialog: boolean;
  // selectedTramiteDestinos: TramiteEntity[];
  // setSelectedTramiteDestinos: Dispatch<SetStateAction<MovimientoEntity[]>>;
};

const TramiteDetailsModal = (props: TramiteDetailsModalProps) => {
  const estadoDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={() => {
          props.hideTramiteDetailsDialog();
        }}
      />
      <Button
        // loading={props.loadingEstadoCreateOrUpdate}
        label="Guardar"
        icon="pi pi-check"
        onClick={() => {}}
      />
    </>
  );

  return (
    <Dialog
      visible={props.tramiteDetailsDialog}
      style={{ width: "40rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Detalle de trámite"
      modal
      className="p-fluid"
      footer={estadoDialogFooter}
      onHide={props.hideTramiteDetailsDialog}
    >
      <div className="flex flex-row" style={{ gap: "1rem" }}>
        <div
          style={{
            width: "30%",
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
            width: "70%",
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
            width: "70%",
          }}
        >
          <label
            htmlFor="CodigoReferencia"
            className="block text-900 text-sm font-medium mb-2"
          >
            Remitente
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
            width: "30%",
          }}
        >
          <label
            htmlFor="CodigoReferencia"
            className="block text-900 text-sm font-medium mb-2"
          >
            Folios
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputNumber
                id="Folios"
                // value={tramite.Folios}
                onChange={(e) => {
                  // onInputNumberChange(e, "Folios");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.Folios && (
              <small className="p-error">{tramiteErrors.Folios}</small>
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
            Asunto
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
            htmlFor="CodigoReferencia"
            className="block text-900 text-sm font-medium mb-2"
          >
            Motivo
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
            htmlFor="Asunto"
            className="block text-900 text-sm font-medium mb-2"
          >
            Observaciones
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputTextarea
                id="Asunto"
                // value={tramite.Asunto}
                // onChange={(e) => onInputTextAreaChange(e, "Asunto")}
                autoFocus
                rows={2}
                // className={classNames({
                //   "p-invalid": props.submitted && !props.documento.Asunto,
                // })}
              />
            </div>
            {/* {tramiteErrors.Asunto && (
              <small className="p-error">{tramiteErrors.Asunto}</small>
            )} */}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TramiteDetailsModal;
