import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { AreaInterface } from "../interfaces/AreaInterface";
import { Button } from "primereact/button";

type AreaCreateOrUpdateProps = {
  submitted: boolean;
  area: AreaInterface;
  areaDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createArea: () => void;
  updateArea: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
};

const AreaCreateOrUpdate = (props: AreaCreateOrUpdateProps) => {
  const areaDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={props.hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={
          props.areaDialog.type == "create"
            ? props.createArea
            : props.updateArea
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.areaDialog.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Área Detalles"
      modal
      className="p-fluid"
      footer={areaDialogFooter}
      onHide={props.hideDialog}
    >
      {/* {area.image && (
              <img
                src={`https://primefaces.org/cdn/primereact/images/area/${area.image}`}
                alt={area.image}
                className="area-image block m-auto pb-3"
              />
            )} */}
      <div className="field">
        <label htmlFor="Descripcion" className="font-bold">
          Descripción
        </label>
        <InputText
          id="Descripcion"
          value={props.area.Descripcion}
          onChange={(e) => props.onInputChange(e, "Descripcion")}
          required
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.area.Descripcion,
          })}
        />
        {props.submitted && !props.area.Descripcion && (
          <small className="p-error">Name is required.</small>
        )}
      </div>
      {/* <div className="field">
              <label htmlFor="description" className="font-bold">
                Description
              </label>
              <InputTextarea
                id="description"
                value={area.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  onInputTextAreaChange(e, "description")
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
                    checked={area.category === "Accessories"}
                  />
                  <label htmlFor="category1">Accessories</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Clothing"
                    onChange={onCategoryChange}
                    checked={area.category === "Clothing"}
                  />
                  <label htmlFor="category2">Clothing</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Electronics"
                    onChange={onCategoryChange}
                    checked={area.category === "Electronics"}
                  />
                  <label htmlFor="category3">Electronics</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Fitness"
                    onChange={onCategoryChange}
                    checked={area.category === "Fitness"}
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
                  value={area.price}
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
                  value={area.quantity}
                  onValueChange={(e) => onInputNumberChange(e, "quantity")}
                />
              </div>
            </div> */}
    </Dialog>
  );
};

export default AreaCreateOrUpdate;
