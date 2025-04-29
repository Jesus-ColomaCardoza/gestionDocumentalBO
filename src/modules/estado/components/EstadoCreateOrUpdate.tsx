import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { EstadoEntity } from "../interfaces/EstadoInterface";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { EsquemaEstadoEntity } from "../../esquema-estado/interfaces/EsquemaEstadoInterface";

type EstadoCreateOrUpdateProps = {
  submitted: boolean;
  estado: EstadoEntity;
  esquemaEstados:  Pick<EsquemaEstadoEntity, "IdEsquemaEstado" | "Descripcion">[];
  estadoDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createEstado: () => void;
  updateEstado: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  onDropdownChange: (
    e: DropdownChangeEvent,
    nameFK: string,
    nameObj: string
  ) => void;
  onActivoChange: (e: RadioButtonChangeEvent) => void;
  loadingEstadoCreateOrUpdate: boolean;
};

const EstadoCreateOrUpdate = (props: EstadoCreateOrUpdateProps) => {
  const estadoDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={() => {
          props.hideDialog();
        }}
      />
      <Button
        loading={props.loadingEstadoCreateOrUpdate}
        label="Save"
        icon="pi pi-check"
        onClick={
          props.estadoDialog.type == "create"
            ? props.createEstado
            : props.updateEstado
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.estadoDialog.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Área Detalles"
      modal
      className="p-fluid"
      footer={estadoDialogFooter}
      onHide={props.hideDialog}
    >
      <div className="field">
        <label htmlFor="Descripcion" className="font-bold">
          Descripción
        </label>
        <InputText
          id="Descripcion"
          value={props.estado.Descripcion}
          onChange={(e) => props.onInputChange(e, "Descripcion")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.estado.Descripcion,
          })}
        />
        {props.submitted && !props.estado.Descripcion && (
          <small className="p-error">Name is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="EsquemaEstado" className="font-bold">
          Esquema Estado
        </label>
        <Dropdown
          value={props.estado.EsquemaEstado}
          onChange={(e) => {
            props.onDropdownChange(e, "IdEsquemaEstado", "EsquemaEstado");
          }}
          options={props.esquemaEstados}
          optionLabel="Descripcion"
          filter
          placeholder="Seleccionar Esquema Estado"
          className="w-full"
          showClear
        />
        {props.submitted && !props.estado.IdEsquemaEstado && (
          <small className="p-error">EsquemaEstado is required.</small>
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
              checked={props.estado.Activo === true}
            />
            <label htmlFor="Activot">True</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="Activof"
              name="Activof"
              value={false}
              onChange={props.onActivoChange}
              checked={props.estado.Activo === false}
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
              <InputTextestado
                id="description"
                value={estado.description}
                onChange={(e: ChangeEvent<HTMLTextEstadoElement>) =>
                  onInputTextEstadoChange(e, "description")
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
                    checked={estado.category === "Accessories"}
                  />
                  <label htmlFor="category1">Accessories</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Clothing"
                    onChange={onCategoryChange}
                    checked={estado.category === "Clothing"}
                  />
                  <label htmlFor="category2">Clothing</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Electronics"
                    onChange={onCategoryChange}
                    checked={estado.category === "Electronics"}
                  />
                  <label htmlFor="category3">Electronics</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Fitness"
                    onChange={onCategoryChange}
                    checked={estado.category === "Fitness"}
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
                  value={estado.price}
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
                  value={estado.quantity}
                  onValueChange={(e) => onInputNumberChange(e, "quantity")}
                />
              </div>
            </div> */}
    </Dialog>
  );
};

export default EstadoCreateOrUpdate;
