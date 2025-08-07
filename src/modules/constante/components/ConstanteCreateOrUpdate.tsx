import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { ConstanteEntity } from "../interfaces/ConstanteInterface";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";

type ConstanteCreateOrUpdateProps = {
  submitted: boolean;
  constante: ConstanteEntity;
  constanteDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createConstante: () => void;
  updateConstante: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  onActivoChange: (e: RadioButtonChangeEvent) => void;
  onInputNumberChange: (e: InputNumberChangeEvent, name: string) => void;
  loadingConstanteCreateOrUpdate: boolean;
};

const ConstanteCreateOrUpdate = (props: ConstanteCreateOrUpdateProps) => {
  const constanteDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={props.hideDialog}
      />
      <Button
        loading={props.loadingConstanteCreateOrUpdate}
        label="Aceptar"
        icon="pi pi-check"
        onClick={
          props.constanteDialog.type == "create"
            ? props.createConstante
            : props.updateConstante
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.constanteDialog.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Constante Detalles"
      modal
      className="p-fluid"
      footer={constanteDialogFooter}
      onHide={props.hideDialog}
    >
      <div className="field">
        <label htmlFor="NombreTecnico" className="font-bold">
          Nombre Tecnico
        </label>
        <InputText
          id="NombreTecnico"
          value={props.constante.NombreTecnico}
          onChange={(e) => props.onInputChange(e, "NombreTecnico")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.constante.NombreTecnico,
          })}
        />
        {props.submitted && !props.constante.NombreTecnico && (
          <small className="p-error">Name is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="IdGrupo" className="font-bold">
          Id Grupo
        </label>
        <InputText
          id="IdGrupo"
          value={props.constante.IdGrupo}
          onChange={(e) => props.onInputChange(e, "IdGrupo")}
          className={classNames({
            "p-invalid": props.submitted && !props.constante.IdGrupo,
          })}
        />
        {props.submitted && !props.constante.IdGrupo && (
          <small className="p-error">Name is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="Valor" className="font-bold">
          Valor
        </label>
        <InputText
          id="Valor"
          value={props.constante.Valor}
          onChange={(e) => props.onInputChange(e, "Valor")}
          className={classNames({
            "p-invalid": props.submitted && !props.constante.Valor,
          })}
        />
        {props.submitted && !props.constante.Valor && (
          <small className="p-error">Value is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="Descripcion" className="font-bold">
          Descripción
        </label>
        <InputText
          id="Descripcion"
          value={props.constante.Descripcion}
          onChange={(e) => props.onInputChange(e, "Descripcion")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.constante.Descripcion,
          })}
        />
        {props.submitted && !props.constante.Descripcion && (
          <small className="p-error">Name is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="IdEmpresa" className="font-bold">
          Id Empresa
        </label>
        <InputNumber
          id="IdEmpresa"
          value={props.constante.IdEmpresa}
          onChange={(e) => props.onInputNumberChange(e, "IdEmpresa")}
          className={classNames({
            "p-invalid": props.submitted && !props.constante.IdEmpresa,
          })}
        />
        {props.submitted && !props.constante.IdEmpresa && (
          <small className="p-error">Id Empresa is required.</small>
        )}
      </div>
      <div className="field">
        <label className="mb-3 font-bold">Activo</label>
        <div className="formgrid grid">
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="Activot"
              name="Activot"
              value={true}
              onChange={props.onActivoChange}
              checked={props.constante.Activo === true}
            />
            <label htmlFor="Activot">True</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="Activof"
              name="Activof"
              value={false}
              onChange={props.onActivoChange}
              checked={props.constante.Activo === false}
            />
            <label htmlFor="Activof">False</label>
          </div>
        </div>
      </div>
      {/* 
      <div className="field">
              <label htmlFor="description" className="font-bold">
                Description
              </label>
              <InputTextconstante
                id="description"
                value={constante.description}
                onChange={(e: ChangeEvent<HTMLTextConstanteElement>) =>
                  onInputTextConstanteChange(e, "description")
                }
                required
                rows={3}
                cols={20}
              />
            </div>
    
            <div className="field">
              <label className="mb-3 font-bold">Category</label>
              <div className="formgrid grid">
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category1"
                    name="category"
                    value="Accessories"
                    onChange={onCategoryChange}
                    checked={constante.category === "Accessories"}
                  />
                  <label htmlFor="category1">Accessories</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Clothing"
                    onChange={onCategoryChange}
                    checked={constante.category === "Clothing"}
                  />
                  <label htmlFor="category2">Clothing</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Electronics"
                    onChange={onCategoryChange}
                    checked={constante.category === "Electronics"}
                  />
                  <label htmlFor="category3">Electronics</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Fitness"
                    onChange={onCategoryChange}
                    checked={constante.category === "Fitness"}
                  />
                  <label htmlFor="category4">Fitness</label>
                </div>
              </div>
            </div>
    
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="price" className="font-bold">
                  Price
                </label>
                <InputNumber
                  id="price"
                  value={constante.price}
                  onValueChange={(e) => onInputNumberChange(e, "price")}
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                />
              </div>
              <div className="field col">
                <label htmlFor="quantity" className="font-bold">
                  Quantity
                </label>
                <InputNumber
                  id="quantity"
                  value={constante.quantity}
                  onValueChange={(e) => onInputNumberChange(e, "quantity")}
                />
              </div>
            </div> */}
    </Dialog>
  );
};

export default ConstanteCreateOrUpdate;
