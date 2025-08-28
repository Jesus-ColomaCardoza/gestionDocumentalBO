import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Dispatch, SetStateAction } from "react";
import { MovimientoEntity } from "../../movimiento/interfaces/MovimientoInterface";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import { UsuarioEntity } from "../../usuario/interfaces/UsuarioInterface";
import {
  TramiteEntity,
  TramitePendienteEntity,
} from "../interfaces/TramiteInterface";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

type TramiteDetailsModalProps = {
  tramitePendiente: TramitePendienteEntity;
  submitted: boolean;
  hideTramiteDetailsDialog: () => void;
  tramiteDetailsDialog: boolean;
  observaciones: string;
  setObservaciones: Dispatch<SetStateAction<string>>;
  recibirTramitesPendintes: () => Promise<void>;

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
        loading={props.submitted}
        label="Guardar"
        icon="pi pi-check"
        onClick={props.recibirTramitesPendintes}
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
            htmlFor="IdTramite"
            className="block text-900 text-sm font-medium mb-2"
          >
            Trámite
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                disabled
                id="IdTramite"
                value={
                  props.tramitePendiente?.Tramite?.IdTramite?.toString().padStart(
                    8,
                    "0"
                  ) || ""
                }
                onChange={(e) => {
                  // onInputTextChange(e, "IdTramite");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.IdTramite && (
              <small className="p-error">
                {tramiteErrors.IdTramite}
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
            htmlFor="Documento"
            className="block text-900 text-sm font-medium mb-2"
          >
            Documento
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                disabled
                id="Documento"
                value={`${
                  props.tramitePendiente?.Documento?.TipoDocumento?.Descripcion?.substring(
                    0,
                    3
                  ) ?? "Doc"
                }. ${
                  props.tramitePendiente?.Documento?.CodigoReferenciaDoc ?? ""
                }`}
                onChange={(e) => {
                  // onInputTextChange(e, "Documento");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.Documento && (
              <small className="p-error">
                {tramiteErrors.Documento}
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
            htmlFor="Remitente"
            className="block text-900 text-sm font-medium mb-2"
          >
            Remitente
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                disabled
                id="Remitente"
                value={`${
                  (props.tramitePendiente?.Tramite?.Remitente?.Nombres || "") +
                  " " +
                  (props.tramitePendiente?.Tramite?.Remitente
                    ?.ApellidoPaterno || "") +
                  " " +
                  (props.tramitePendiente?.Tramite?.Remitente
                    ?.ApellidoMaterno || "")
                }`}
                onChange={(e) => {
                  // onInputTextChange(e, "Remitente");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.Remitente && (
              <small className="p-error">
                {tramiteErrors.Remitente}
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
            htmlFor="Folios"
            className="block text-900 text-sm font-medium mb-2"
          >
            Folios
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputNumber
                disabled
                id="Folios"
                value={props.tramitePendiente?.Documento?.Folios || 0}
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
            htmlFor="Asunto"
            className="block text-900 text-sm font-medium mb-2"
          >
            Asunto
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                disabled
                id="Asunto"
                value={props.tramitePendiente?.Documento?.Asunto || ""}
                onChange={(e) => {
                  // onInputTextChange(e, "Asunto");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.Asunto && (
              <small className="p-error">
                {tramiteErrors.Asunto}
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
            htmlFor="Motivo"
            className="block text-900 text-sm font-medium mb-2"
          >
            Motivo
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                disabled
                id="Motivo"
                value={props.tramitePendiente?.Motivo || ""}
                onChange={(e) => {
                  // onInputTextChange(e, "Motivo");
                }}
                type="text"
                className="p-inputtext-sm "
              />
            </div>
            {/* {tramiteErrors.Motivo && (
              <small className="p-error">
                {tramiteErrors.Motivo}
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
            htmlFor="Observaciones"
            className="block text-900 text-sm font-medium mb-2"
          >
            Observaciones
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputTextarea
                id="Observaciones"
                value={props.observaciones || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  const value = (e.target && e.target.value) || "";

                  props.setObservaciones(value);
                }}
                autoFocus
                rows={2}
                // className={classNames({
                //   "p-invalid": props.submitted && !props.documento.Observaciones,
                // })}
              />
            </div>
            {/* {tramiteErrors.Observaciones && (
              <small className="p-error">{tramiteErrors.Observaciones}</small>
            )} */}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TramiteDetailsModal;
