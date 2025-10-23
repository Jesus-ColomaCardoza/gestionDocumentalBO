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
import { ArchivadorEntity } from "../../archivador/interfaces/ArchivadorInterface";
import { ar } from "date-fns/locale";

type TramiteArchivadoModalProps = {
  submitted: boolean;
  hideTramiteArchivadoDialog: () => void;
  tramiteArchivarDialog: boolean;
  selectedTramitesRecibidos: TramiteRecibidoEntity[];
  tramiteRecibido: TramiteRecibidoEntity;
  archivadores: Pick<
    ArchivadorEntity,
    "IdArchivador" | "Descripcion" | "Nombre"
  >[];
  setArchivador: Dispatch<
    SetStateAction<
      Pick<ArchivadorEntity, "IdArchivador" | "Descripcion"> | null | undefined
    >
  >;
  archivador:
    | Pick<ArchivadorEntity, "IdArchivador" | "Descripcion">
    | null
    | undefined;
  detalle: string;
  setDetalle: Dispatch<SetStateAction<string>>;
  archivarTramitesRecibidos: () => Promise<void>;
  tramiteArchivadosErrors: any;
  setTramiteArchivadosErrors: Dispatch<any>;
};

const TramiteArchivadoModal = (props: TramiteArchivadoModalProps) => {
  const validateForm = () => {
    let fieldErrors: any = {};

    if (props?.archivador?.IdArchivador == null) {
      fieldErrors.archivador = "Archivador es obligatorio.";
    }

    props.setTramiteArchivadosErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const estadoDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={() => {
          props.hideTramiteArchivadoDialog();
        }}
      />
      <Button
        loading={props.submitted}
        label="Archivar"
        icon="pi pi-check"
        onClick={() => {
          if (validateForm()) {
            props.archivarTramitesRecibidos();
            props.hideTramiteArchivadoDialog();
          }
        }}
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
      onHide={props.hideTramiteArchivadoDialog}
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
                  props.selectedTramitesRecibidos?.length > 0
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
                    : props.tramiteRecibido?.Tramite?.IdTramite.toString().padStart(
                        8,
                        "0"
                      )
                }
                // onChange={(e) => onInputTextAreaChange(e, "Asunto")}
                autoFocus
                rows={
                  props.selectedTramitesRecibidos?.length > 0
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
                  props.selectedTramitesRecibidos?.length > 0
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
                    : props.tramiteRecibido?.Documento?.TipoDocumento
                        ?.Descripcion +
                      " " +
                      props.tramiteRecibido?.Documento?.CodigoReferenciaDoc
                }
                // onChange={(e) => onInputTextAreaChange(e, "Documento")}
                autoFocus
                rows={
                  props.selectedTramitesRecibidos?.length > 0
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
            htmlFor="AreaEmision"
            className="block text-900 text-sm font-medium mb-2"
          >
            Archivador
          </label>
          <div className="flex flex-column  mb-3 gap-1">
            <div className="p-inputgroup">
              <Dropdown
                value={props.archivador}
                onChange={(e: DropdownChangeEvent) => {
                  const value = e.value || "";

                  props.setArchivador(value);

                  props.setTramiteArchivadosErrors((prev: any) => ({
                    ...prev,
                    ["archivador"]: undefined,
                  }));
                }}
                options={props.archivadores}
                optionLabel="Nombre"
                filter
                placeholder="Seleccionar archivador"
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
            {props.tramiteArchivadosErrors?.archivador && (
              <small className="p-error">
                {props.tramiteArchivadosErrors.archivador}
              </small>
            )}
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
            htmlFor="Detalle"
            className="block text-900 text-sm font-medium mb-2"
          >
            Detalle
          </label>
          <div className="flex flex-column mb-3 gap-1">
            <div className="p-inputgroup">
              <InputText
                id="Detalle"
                value={props.detalle || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = (e.target && e.target.value) || "";
                  props.setDetalle(value);
                }}
                type="text"
                className="p-inputtext-sm "
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
    </Dialog>
  );
};

export default TramiteArchivadoModal;
