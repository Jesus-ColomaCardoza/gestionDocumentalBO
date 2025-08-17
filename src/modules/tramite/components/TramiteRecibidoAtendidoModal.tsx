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
import { useNavigate } from "react-router-dom";

type TramiteRecibidoAtendidoModalProps = {
  submitted: boolean;
  hideTramiteRecibidoAtendidoDialog: (type: "multiple" | "simple") => void;
  showTramiteRecibidoAtendidoDialog: (type: "multiple" | "simple") => void;
  tramiteRecibidoAtendidoDialog: {
    type: "multiple" | "simple";
    state: boolean;
  };
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
              navigate("../tramite/recibido/atendido");
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
          // loading={props.loadingEstadoCreateOrUpdate}
          label="Guardar"
          icon="pi pi-check"
          size="small"
          onClick={() => {}}
        />
      </div>
    </div>
  );

  return (
    <Dialog
      visible={props.tramiteRecibidoAtendidoDialog.state}
      style={{ width: "40rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Detalle de trámite"
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

export default TramiteRecibidoAtendidoModal;
