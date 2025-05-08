import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { TipoUsuarioEntity } from "../interfaces/TipoUsuarioInterface";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";

type TipoUsuarioCreateOrUpdateProps = {
  submitted: boolean;
  tipoUsuario: TipoUsuarioEntity;
  tipoUsuarioDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createTipoUsuario: () => void;
  updateTipoUsuario: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  onActivoChange: (e: RadioButtonChangeEvent) => void;
  loadingTipoUsuarioCreateOrUpdate: boolean;
};

const TipoUsuarioCreateOrUpdate = (props: TipoUsuarioCreateOrUpdateProps) => {
  const tipoUsuarioDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={props.hideDialog}
      />
      <Button
        loading={props.loadingTipoUsuarioCreateOrUpdate}
        label="Aceptar"
        icon="pi pi-check"
        onClick={
          props.tipoUsuarioDialog.type == "create"
            ? props.createTipoUsuario
            : props.updateTipoUsuario
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.tipoUsuarioDialog.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Área Detalles"
      modal
      className="p-fluid"
      footer={tipoUsuarioDialogFooter}
      onHide={props.hideDialog}
    >
      <div className="field">
        <label htmlFor="Descripcion" className="font-bold">
          Descripción
        </label>
        <InputText
          id="Descripcion"
          value={props.tipoUsuario.Descripcion}
          onChange={(e) => props.onInputChange(e, "Descripcion")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.tipoUsuario.Descripcion,
          })}
        />
        {props.submitted && !props.tipoUsuario.Descripcion && (
          <small className="p-error">Name is required.</small>
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
              checked={props.tipoUsuario.Activo === true}
            />
            <label htmlFor="Activot">True</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="Activof"
              name="Activof"
              value={false}
              onChange={props.onActivoChange}
              checked={props.tipoUsuario.Activo === false}
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
              <InputTexttipoUsuario
                id="description"
                value={tipoUsuario.description}
                onChange={(e: ChangeEvent<HTMLTextTipoUsuarioElement>) =>
                  onInputTextTipoUsuarioChange(e, "description")
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
                    checked={tipoUsuario.category === "Accessories"}
                  />
                  <label htmlFor="category1">Accessories</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Clothing"
                    onChange={onCategoryChange}
                    checked={tipoUsuario.category === "Clothing"}
                  />
                  <label htmlFor="category2">Clothing</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Electronics"
                    onChange={onCategoryChange}
                    checked={tipoUsuario.category === "Electronics"}
                  />
                  <label htmlFor="category3">Electronics</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Fitness"
                    onChange={onCategoryChange}
                    checked={tipoUsuario.category === "Fitness"}
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
                  value={tipoUsuario.price}
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
                  value={tipoUsuario.quantity}
                  onValueChange={(e) => onInputNumberChange(e, "quantity")}
                />
              </div>
            </div> */}
    </Dialog>
  );
};

export default TipoUsuarioCreateOrUpdate;
