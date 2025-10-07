import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { EmpresaEntity } from "../interfaces/EmpresaInterface";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";

type EmpresaCreateOrUpdateProps = {
  submitted: boolean;
  empresa: EmpresaEntity;
  empresaDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createEmpresa: () => void;
  updateEmpresa: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  onActivoChange: (e: RadioButtonChangeEvent) => void;
  loadingEmpresaCreateOrUpdate: boolean;
};

const EmpresaCreateOrUpdate = (props: EmpresaCreateOrUpdateProps) => {
  const empresaDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={props.hideDialog}
      />
      <Button
        loading={props.loadingEmpresaCreateOrUpdate}
        label="Aceptar"
        icon="pi pi-check"
        onClick={
          props.empresaDialog.type == "create"
            ? props.createEmpresa
            : props.updateEmpresa
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.empresaDialog.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Empresa Detalles"
      modal
      className="p-fluid"
      footer={empresaDialogFooter}
      onHide={props.hideDialog}
    >
      <div className="field">
        <label htmlFor="Descripcion" className="font-bold">
          Descripción
        </label>
        <InputText
          id="Descripcion"
          value={props.empresa.Descripcion}
          onChange={(e) => props.onInputChange(e, "Descripcion")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.empresa.Descripcion,
          })}
        />
        {props.submitted && !props.empresa.Descripcion && (
          <small className="p-error">Descripcion is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="NroIdentificacion" className="font-bold">
          Nro Identificación
        </label>
        <InputText
          id="NroIdentificacion"
          value={props.empresa.NroIdentificacion}
          onChange={(e) => props.onInputChange(e, "NroIdentificacion")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.empresa.NroIdentificacion,
          })}
        />
        {props.submitted && !props.empresa.NroIdentificacion && (
          <small className="p-error">NroIdentificacion is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="Email" className="font-bold">
          Email
        </label>
        <InputText
          id="Email"
          value={props.empresa.Email}
          onChange={(e) => props.onInputChange(e, "Email")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.empresa.Email,
          })}
        />
        {props.submitted && !props.empresa.Email && (
          <small className="p-error">Email is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="Celular" className="font-bold">
          Celular
        </label>
        <InputText
          id="Celular"
          value={props.empresa.Celular}
          onChange={(e) => props.onInputChange(e, "Celular")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.empresa.Celular,
          })}
        />
        {props.submitted && !props.empresa.Celular && (
          <small className="p-error">Celular is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="RazonSocial" className="font-bold">
          Razon Social
        </label>
        <InputText
          id="RazonSocial"
          value={props.empresa.RazonSocial}
          onChange={(e) => props.onInputChange(e, "RazonSocial")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.empresa.RazonSocial,
          })}
        />
        {props.submitted && !props.empresa.RazonSocial && (
          <small className="p-error">Celular is required.</small>
        )}
      </div>
      {/* <div className="field">
        <label htmlFor="LogoNombre" className="font-bold">
          Logo Nombre
        </label>
        <InputText
          id="LogoNombre"
          value={props.empresa.LogoNombre}
          onChange={(e) => props.onInputChange(e, "LogoNombre")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.empresa.LogoNombre,
          })}
        />
        {props.submitted && !props.empresa.LogoNombre && (
          <small className="p-error">LogoNombre is required.</small>
        )}
      </div> */}
      {/* <div className="field">
        <label htmlFor="LogoBase64" className="font-bold">
          LogoBase64
        </label>
        <InputText
          id="LogoBase64"
          value={props.empresa.LogoBase64}
          onChange={(e) => props.onInputChange(e, "LogoBase64")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.empresa.LogoBase64,
          })}
        />
        {props.submitted && !props.empresa.LogoBase64 && (
          <small className="p-error">LogoBase64 is required.</small>
        )}
      </div> */}
      <div className="field">
        <label className="mb-3 font-bold">Activo</label>
        <div className="formgrid grid">
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="Activot"
              name="Activot"
              value={true}
              onChange={props.onActivoChange}
              checked={props.empresa.Activo === true}
            />
            <label htmlFor="Activot">True</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="Activof"
              name="Activof"
              value={false}
              onChange={props.onActivoChange}
              checked={props.empresa.Activo === false}
            />
            <label htmlFor="Activof">False</label>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EmpresaCreateOrUpdate;
