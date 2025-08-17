import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Dispatch, SetStateAction } from "react";
import { MovimientoEntity } from "../../movimiento/interfaces/MovimientoInterface";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { AreaEntity } from "../../area/interfaces/AreaInterface";
import { UsuarioEntity } from "../../usuario/interfaces/UsuarioInterface";

type TramiteDestinosModalProps = {
  submitted: boolean;
  hideTramiteDestinosDialog: () => void;
  tramiteDestinosDialog: boolean;
  selectedTramiteDestinos: MovimientoEntity[];
  setSelectedTramiteDestinos: Dispatch<SetStateAction<MovimientoEntity[]>>;
  tramiteDestinosErrors: any;
  setTramiteDestinosErrors: Dispatch<any>;
  movimiento: MovimientoEntity;
  areas: Pick<AreaEntity, "IdArea" | "Descripcion">[];
  remitentes: Pick<
    UsuarioEntity,
    "IdUsuario" | "Nombres" | "ApellidoPaterno" | "ApellidoMaterno"
  >[];
  setMovimiento: Dispatch<SetStateAction<MovimientoEntity>>;
  onInputTextChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => void;
  onDropdownChangeMovimiento: (
    e: DropdownChangeEvent,
    nameObj: string,
    nameFK: string,
    nameTagFK?: string
  ) => void;
  onSwitchChange: (e: InputSwitchChangeEvent, name: string) => void;
};

const TramiteDestinosModal = (props: TramiteDestinosModalProps) => {
  const validateForm = () => {
    let fieldErrors: any = {};

    if (props.movimiento.AreaDestino.IdArea === 0) {
      fieldErrors.AreaDestino = "Área de destino es obligatorio.";
    }

    props.setTramiteDestinosErrors(fieldErrors);

    return Object.keys(fieldErrors).length === 0;
  };

  const estadoDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={() => {
          props.hideTramiteDestinosDialog();
        }}
      />
      <Button
        // loading={props.loadingEstadoCreateOrUpdate}
        label="Aceptar"
        icon="pi pi-check"
        onClick={() => {
          if (validateForm()) {
            props.setSelectedTramiteDestinos((prev) => [
              ...prev,
              {...props.movimiento,IdMovimiento:new Date().getTime(), FechaMovimiento: new Date().toISOString()},
            ]);
            props.hideTramiteDestinosDialog();
          }
        }}
      />
    </>
  );

  return (
    <Dialog
      visible={props.tramiteDestinosDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Nuevo Destino"
      modal
      className="p-fluid"
      footer={estadoDialogFooter}
      onHide={props.hideTramiteDestinosDialog}
    >
      <div className="field">
        <label
          htmlFor="AreaEmision"
          className="block text-900 text-sm font-medium mb-2"
        >
          Área Emisión
        </label>
        <div className="flex flex-column  gap-1">
          <div className="p-inputgroup">
            <Dropdown
              value={props.movimiento.AreaDestino}
              onChange={(e) => {
                props.onDropdownChangeMovimiento(
                  e,
                  "AreaDestino",
                  "IdArea",
                  "IdAreaDestino"
                );
              }}
              options={props.areas}
              optionLabel="Descripcion"
              filter
              placeholder="Seleccionar Área de Emisión"
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
          {props.tramiteDestinosErrors?.AreaDestino && (
            <small className="p-error">
              {props.tramiteDestinosErrors.AreaDestino}
            </small>
          )}
        </div>
      </div>

      <div className="field">
        <label
          htmlFor="Remitente"
          className="block text-900 text-sm font-medium mb-2"
        >
          Personal responsable
        </label>
        <div className="flex flex-column mb-3 gap-1">
          <div className="p-inputgroup">
            <Dropdown
              value={props.movimiento.NombreResponsable}
              onChange={(e) => {
                props.onDropdownChangeMovimiento(
                  e,
                  "NombreResponsable",
                  "NombreCompleto"
                );
              }}
              options={props.remitentes}
              optionLabel="NombreCompleto"
              filter
              placeholder="Seleccionar personal"
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
          {props.tramiteDestinosErrors?.NombreResponsable && (
            <small className="p-error">
              {props.tramiteDestinosErrors.NombreResponsable}
            </small>
          )}
        </div>
      </div>

      <div className="field">
        <div className="flex justify-content-between pr-3">
          <div className="flex align-items-center gap-2">
            <InputSwitch
              id="Copia"
              checked={props.movimiento.Copia ?? false}
              onChange={(e) => props.onSwitchChange(e, "Copia")}
              style={{
                height: "1.5em",
              }}
            />
            <label htmlFor="Copia" className="font-bold m-0">
              Para copia
            </label>
          </div>

          {props.movimiento.NombreResponsable &&
          typeof props.movimiento.NombreResponsable === "object" &&
          Object.keys(props.movimiento.NombreResponsable).length > 0 ? (
            <div className="flex align-items-center gap-2">
              <InputSwitch
                id="FirmaDigital"
                checked={props.movimiento.FirmaDigital ?? false}
                onChange={(e) => props.onSwitchChange(e, "FirmaDigital")}
                style={{
                  height: "1.5em",
                }}
              />
              <label htmlFor="FirmaDigital" className="font-bold m-0">
                Para firmar
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </Dialog>
  );
};

export default TramiteDestinosModal;
