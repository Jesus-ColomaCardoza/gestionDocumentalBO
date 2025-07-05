import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { UsuarioEntity } from "../interfaces/UsuarioInterface";
import { Button } from "primereact/button";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { TipoIdentificacionEntity } from "../../tipo-identificacion/interfaces/TipoIdentificacionInterface";
import { TipoUsuarioEntity } from "../../tipo-usuario/interfaces/TipoUsuarioInterface";
import { RolEntity } from "../../rol/interfaces/RolInterface";
import { CargoEntity } from "../../cargo/interfaces/CargoInterface";
import { AreaEntity } from "../../area/interfaces/AreaInterface";

type UsuarioCreateOrUpdateProps = {
  submitted: boolean;
  usuario: UsuarioEntity;
  tiposIdentificacion:  Pick<TipoIdentificacionEntity, "IdTipoIdentificacion" | "Descripcion">[];
  tiposUsuario:  Pick<TipoUsuarioEntity, "IdTipoUsuario" | "Descripcion">[];
  roles:  Pick<RolEntity, "IdRol" | "Descripcion">[];
  cargos:  Pick<CargoEntity, "IdCargo" | "Descripcion">[];
  areas:  Pick<AreaEntity, "IdArea" | "Descripcion">[];
  usuarioDialog: {
    type?: "create" | "update" | undefined;
    state: boolean;
  };
  hideDialog: () => void;
  createUsuario: () => void;
  updateUsuario: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  onDropdownChange: (
    e: DropdownChangeEvent,
    nameFK: string,
    nameObj: string
  ) => void;
  onActivoChange: (e: RadioButtonChangeEvent) => void;
  loadingUsuarioCreateOrUpdate: boolean;
};

const UsuarioCreateOrUpdate = (props: UsuarioCreateOrUpdateProps) => {
  const usuarioDialogFooter = (
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
        loading={props.loadingUsuarioCreateOrUpdate}
        label="Aceptar"
        icon="pi pi-check"
        onClick={
          props.usuarioDialog.type == "create"
            ? props.createUsuario
            : props.updateUsuario
        }
      />
    </>
  );

  return (
    <Dialog
      visible={props.usuarioDialog.state}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Área Detalles"
      modal
      className="p-fluid"
      footer={usuarioDialogFooter}
      onHide={props.hideDialog}
    >
      <div className="field">
        <label htmlFor="Nombres" className="font-bold">
          Nombres
        </label>
        <InputText
          id="Nombres"
          value={props.usuario.Nombres}
          onChange={(e) => props.onInputChange(e, "Nombres")}
          autoFocus
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.Nombres,
          })}
        />
        {props.submitted && !props.usuario.Nombres && (
          <small className="p-error">Name is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="ApellidoPaterno" className="font-bold">
          Apellido Paterno
        </label>
        <InputText
          id="ApellidoPaterno"
          value={props.usuario.ApellidoPaterno}
          onChange={(e) => props.onInputChange(e, "ApellidoPaterno")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.ApellidoPaterno,
          })}
        />
        {props.submitted && !props.usuario.ApellidoPaterno && (
          <small className="p-error">Apellido Paterno is required.</small>
        )}</div>

      <div className="field">
        <label htmlFor="TipoIdentificacion" className="font-bold">
          Tipo Identificacion
        </label>
        <Dropdown
          value={props.usuario.TipoIdentificacion}
          onChange={(e) => {
            props.onDropdownChange(e, "IdTipoIdentificacion", "TipoIdentificacion");
          }}
          options={props.tiposIdentificacion}
          optionLabel="Descripcion"
          filter
          placeholder="Seleccionar Tipo Identificacion"
          className="w-full"
          showClear
        />
        {props.submitted && !props.usuario.IdTipoIdentificacion && (
          <small className="p-error">TipoIdentificacion is required.</small>
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
              checked={props.usuario.Activo === true}
            />
            <label htmlFor="Activot">True</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="Activof"
              name="Activof"
              value={false}
              onChange={props.onActivoChange}
              checked={props.usuario.Activo === false}
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
              <InputTextusuario
                id="description"
                value={usuario.description}
                onChange={(e: ChangeEvent<HTMLTextUsuarioElement>) =>
                  onInputTextUsuarioChange(e, "description")
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
                    checked={usuario.category === "Accessories"}
                  />
                  <label htmlFor="category1">Accessories</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category2"
                    name="category"
                    value="Clothing"
                    onChange={onCategoryChange}
                    checked={usuario.category === "Clothing"}
                  />
                  <label htmlFor="category2">Clothing</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category3"
                    name="category"
                    value="Electronics"
                    onChange={onCategoryChange}
                    checked={usuario.category === "Electronics"}
                  />
                  <label htmlFor="category3">Electronics</label>
                </div>
                <div className="field-radiobutton col-6">
                  <RadioButton
                    inputId="category4"
                    name="category"
                    value="Fitness"
                    onChange={onCategoryChange}
                    checked={usuario.category === "Fitness"}
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
                  value={usuario.price}
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
                  value={usuario.quantity}
                  onValueChange={(e) => onInputNumberChange(e, "quantity")}
                />
              </div>
            </div> */}
    </Dialog>
  );
};

export default UsuarioCreateOrUpdate;
