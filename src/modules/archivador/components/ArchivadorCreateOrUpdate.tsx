import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { ArchivadorEntity } from "../interfaces/ArchivadorInterface";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { InputNumber, InputNumberChangeEvent } from "primereact/inputnumber";

type ArchivadorCreateOrUpdateProps = {
  submitted: boolean;
  archivador: ArchivadorEntity;
  archivadorDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createArchivador: () => void;
  updateArchivador: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  onInputNumberChange: (e: InputNumberChangeEvent, name: string) => void;

  onActivoChange: (e: RadioButtonChangeEvent) => void;
  loadingArchivadorCreateOrUpdate: boolean;
};

const ArchivadorCreateOrUpdate = (props: ArchivadorCreateOrUpdateProps) => {
  const archivadorDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={props.hideDialog}
      />
      <Button
        loading={props.loadingArchivadorCreateOrUpdate}
        label="Aceptar"
        icon="pi pi-check"
        onClick={
          props.archivadorDialog.type == "create"
            ? props.createArchivador
            : props.updateArchivador
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.archivadorDialog.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Archivador Detalles"
      modal
      className="p-fluid"
      footer={archivadorDialogFooter}
      onHide={props.hideDialog}
    >
      
      <div className="field">
        <label htmlFor="Ano" className="font-bold">
          Año
        </label>
        <InputNumber
          id="Ano"
          value={props.archivador.Ano}
          onChange={(e) => props.onInputNumberChange(e, "Ano")}
          className={classNames({
            "p-invalid": props.submitted && !props.archivador.Ano,
          })}
        />
        {props.submitted && !props.archivador.Ano && (
          <small className="p-error">Year is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="Nombre" className="font-bold">
          Nombre
        </label>
        <InputText
          id="Nombre"
          value={props.archivador.Nombre}
          onChange={(e) => props.onInputChange(e, "Nombre")}
          className={classNames({
            "p-invalid": props.submitted && !props.archivador.Nombre,
          })}
        />
        {props.submitted && !props.archivador.Nombre && (
          <small className="p-error">Name is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="Descripcion" className="font-bold">
          Descripción
        </label>
        <InputText
          id="Descripcion"
          value={props.archivador.Descripcion}
          onChange={(e) => props.onInputChange(e, "Descripcion")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.archivador.Descripcion,
          })}
        />
        {props.submitted && !props.archivador.Descripcion && (
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
              checked={props.archivador.Activo === true}
            />
            <label htmlFor="Activot">True</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="Activof"
              name="Activof"
              value={false}
              onChange={props.onActivoChange}
              checked={props.archivador.Activo === false}
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
              <InputTextarchivador
                id="description"
                value={archivador.description}
                onChange={(e: ChangeEvent<HTMLTextArchivadorElement>) =>
                  onInputTextArchivadorChange(e, "description")
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
                    checked={archivador.category === "Accessories"}
                  />
                  <label htmlFor="category1">Accessories</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Clothing"
                    onChange={onCategoryChange}
                    checked={archivador.category === "Clothing"}
                  />
                  <label htmlFor="category2">Clothing</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Electronics"
                    onChange={onCategoryChange}
                    checked={archivador.category === "Electronics"}
                  />
                  <label htmlFor="category3">Electronics</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Fitness"
                    onChange={onCategoryChange}
                    checked={archivador.category === "Fitness"}
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
                  value={archivador.price}
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
                  value={archivador.quantity}
                  onValueChange={(e) => onInputNumberChange(e, "quantity")}
                />
              </div>
            </div> */}
    </Dialog>
  );
};

export default ArchivadorCreateOrUpdate;
