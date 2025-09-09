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
  TramiteRecibidoEntity,
} from "../interfaces/TramiteInterface";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useNavigate } from "react-router-dom";

type TramiteRecibidoAtendidoModalProps = {
  submitted: boolean;
  hideTramiteRecibidoAtendidoDialog: (type: "multiple" | "simple") => void;
  showTramiteRecibidoAtendidoDialog: (
    type: "multiple" | "simple",
    tramiteRecibido: TramiteRecibidoEntity
  ) => void;
  tramiteRecibidoAtendidoDialog: {
    type: "multiple" | "simple";
    state: boolean;
  };
  selectedTramitesRecibidos: TramiteRecibidoEntity[];
  tramiteRecibido: TramiteRecibidoEntity;
  observaciones: string;
  setObservaciones: Dispatch<SetStateAction<string>>;
  atenderTramitesRecibidos: () => Promise<void>;
  // selectedTramiteDestinos: TramiteEntity[];
  // setSelectedTramiteDestinos: Dispatch<SetStateAction<MovimientoEntity[]>>;
};

const TramiteRecibidoAtendidoModal = (
  props: TramiteRecibidoAtendidoModalProps
) => {
  const navigate = useNavigate();

  const estadoDialogFooter = (
    <div className="flex flex-row justify-content-between">
      <div>
        {props.tramiteRecibidoAtendidoDialog.type == "multiple" && (
          <Button
            label="Atender con documento"
            icon="pi pi-file-arrow-up"
            outlined
            severity="success"
            size="small"
            onClick={() => {
              props.hideTramiteRecibidoAtendidoDialog("simple");
              navigate(
                `../tramite/recibido/atendido/${props.tramiteRecibido.IdMovimiento}`
              );
            }}
          />
        )}
      </div>
      <div>
        <Button
          label="Cancel"
          icon="pi pi-times"
          outlined
          size="small"
          onClick={() => {
            props.hideTramiteRecibidoAtendidoDialog("simple");
          }}
        />
        <Button
          loading={props.submitted}
          label="Guardar"
          icon="pi pi-check"
          size="small"
          onClick={props.atenderTramitesRecibidos}
        />
      </div>
    </div>
  );

  return (
    <Dialog
      visible={props.tramiteRecibidoAtendidoDialog.state}
      style={{ width: "40rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Detalle de trámite a atander"
      modal
      className="p-fluid"
      footer={estadoDialogFooter}
      onHide={() => {
        props.hideTramiteRecibidoAtendidoDialog("simple");
      }}
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
              <InputTextarea
                id="IdTramite"
                value={
                  props.selectedTramitesRecibidos.length > 0
                    ? props.selectedTramitesRecibidos
                        .map(
                          (str, index) =>
                            `${
                              index + 1
                            }. ${str.Tramite.IdTramite.toString().padStart(
                              8,
                              "0"
                            )}`
                        )
                        .join("\n")
                    : props.tramiteRecibido.Tramite?.IdTramite.toString().padStart(
                        8,
                        "0"
                      )
                }
                // onChange={(e) => onInputTextAreaChange(e, "Asunto")}
                autoFocus
                rows={
                  props.selectedTramitesRecibidos.length > 0
                    ? props.selectedTramitesRecibidos.length
                    : 1
                }
                // className={classNames({
                //   "p-invalid": props.submitted && !props.documento.Asunto,
                // })}
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
            htmlFor="Detalle"
            className="block text-900 text-sm font-medium mb-2"
          >
            Documento
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputTextarea
                id="Documento"
                value={
                  props.selectedTramitesRecibidos.length > 0
                    ? props.selectedTramitesRecibidos
                        .map(
                          (str, index) =>
                            `${index + 1}. ${
                              (str.Documento?.TipoDocumento?.Descripcion ||
                                "") +
                              " " +
                              (str.Documento?.CodigoReferenciaDoc || "")
                            }`
                        )
                        .join("\n")
                    : props.tramiteRecibido.Documento?.TipoDocumento
                        ?.Descripcion +
                      " " +
                      props.tramiteRecibido.Documento?.CodigoReferenciaDoc
                }
                // onChange={(e) => onInputTextAreaChange(e, "Documento")}
                autoFocus
                rows={
                  props.selectedTramitesRecibidos.length > 0
                    ? props.selectedTramitesRecibidos.length
                    : 1
                }
                // className={classNames({
                //   "p-invalid": props.submitted && !props.documento.Documento,
                // })}
              />
            </div>
            {/* {tramiteErrors.Detalle && (
              <small className="p-error">
                {tramiteErrors.Detalle}
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
            Asunto
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputTextarea
                id="Asunto"
                value={
                  props.selectedTramitesRecibidos.length > 0
                    ? props.selectedTramitesRecibidos
                        .map(
                          (str, index) =>
                            `${index + 1}. ${str.Documento?.Asunto || ""}`
                        )
                        .join("\n")
                    : props.tramiteRecibido.Documento?.Asunto
                }
                 // onChange={(e) => onInputTextAreaChange(e, "Asunto")}
                autoFocus
                rows={
                  props.selectedTramitesRecibidos.length > 0
                    ? props.selectedTramitesRecibidos.length
                    : 1
                }
                // className={classNames({
                //   "p-invalid": props.submitted && !props.documento.Asunto,
                // })}
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

export default TramiteRecibidoAtendidoModal;
