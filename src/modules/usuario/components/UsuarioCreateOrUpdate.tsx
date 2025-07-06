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
  tiposIdentificacion: Pick<
    TipoIdentificacionEntity,
    "IdTipoIdentificacion" | "Descripcion"
  >[];
  tiposUsuario: Pick<TipoUsuarioEntity, "IdTipoUsuario" | "Descripcion">[];
  roles: Pick<RolEntity, "IdRol" | "Descripcion">[];
  cargos: Pick<CargoEntity, "IdCargo" | "Descripcion">[];
  areas: Pick<AreaEntity, "IdArea" | "Descripcion">[];
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
          <small className="p-error">Nombres is required.</small>
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
          <small className="p-error">ApellidoPaterno is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="ApellidoMaterno" className="font-bold">
          Apellido Materno
        </label>
        <InputText
          id="ApellidoMaterno"
          value={props.usuario.ApellidoMaterno}
          onChange={(e) => props.onInputChange(e, "ApellidoMaterno")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.ApellidoMaterno,
          })}
        />
        {props.submitted && !props.usuario.ApellidoMaterno && (
          <small className="p-error">ApellidoMaterno is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="Email" className="font-bold">
          Email
        </label>
        <InputText
          id="Email"
          value={props.usuario.Email}
          onChange={(e) => props.onInputChange(e, "Email")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.Email,
          })}
        />
        {props.submitted && !props.usuario.Email && (
          <small className="p-error">Email is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="Contrasena" className="font-bold">
          Contrasena
        </label>
        <InputText
          id="Contrasena"
          value={props.usuario.Contrasena}
          onChange={(e) => props.onInputChange(e, "Contrasena")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.Contrasena,
          })}
        />
        {props.submitted && !props.usuario.Contrasena && (
          <small className="p-error">Contrasena is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="Celular" className="font-bold">
          Celular
        </label>
        <InputText
          id="Celular"
          value={props.usuario.Celular}
          onChange={(e) => props.onInputChange(e, "Celular")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.Celular,
          })}
        />
        {props.submitted && !props.usuario.Celular && (
          <small className="p-error">Celular is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="RazonSocial" className="font-bold">
          Razon Social
        </label>
        <InputText
          id="RazonSocial"
          value={props.usuario.RazonSocial}
          onChange={(e) => props.onInputChange(e, "RazonSocial")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.RazonSocial,
          })}
        />
        {props.submitted && !props.usuario.RazonSocial && (
          <small className="p-error">RazonSocial is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="TipoIdentificacion" className="font-bold">
          Tipo Identificacion
        </label>
        <Dropdown
          value={props.usuario.TipoIdentificacion}
          onChange={(e) => {
            props.onDropdownChange(
              e,
              "IdTipoIdentificacion",
              "TipoIdentificacion"
            );
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
        <label htmlFor="NroIdentificacion" className="font-bold">
          Nro Identificacion
        </label>
        <InputText
          id="NroIdentificacion"
          value={props.usuario.NroIdentificacion}
          onChange={(e) => props.onInputChange(e, "NroIdentificacion")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.NroIdentificacion,
          })}
        />
        {props.submitted && !props.usuario.NroIdentificacion && (
          <small className="p-error">NroIdentificacion is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="TipoUsuario" className="font-bold">
          Tipo Usuario
        </label>
        <Dropdown
          value={props.usuario.TipoUsuario}
          onChange={(e) => {
            props.onDropdownChange(e, "IdTipoUsuario", "TipoUsuario");
          }}
          options={props.tiposUsuario}
          optionLabel="Descripcion"
          filter
          placeholder="Seleccionar Tipo Usuario"
          className="w-full"
          showClear
        />
        {props.submitted && !props.usuario.IdTipoUsuario && (
          <small className="p-error">TipoUsuario is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="Rol" className="font-bold">
          Rol
        </label>
        <Dropdown
          value={props.usuario.Rol}
          onChange={(e) => {
            props.onDropdownChange(e, "IdRol", "Rol");
          }}
          options={props.roles}
          optionLabel="Descripcion"
          filter
          placeholder="Seleccionar Rol"
          className="w-full"
          showClear
        />
        {props.submitted && !props.usuario.IdRol && (
          <small className="p-error">Rol is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="Cargo" className="font-bold">
          Cargo
        </label>
        <Dropdown
          value={props.usuario.Cargo}
          onChange={(e) => {
            props.onDropdownChange(e, "IdCargo", "Cargo");
          }}
          options={props.cargos}
          optionLabel="Descripcion"
          filter
          placeholder="Seleccionar Cargo"
          className="w-full"
          showClear
        />
        {props.submitted && !props.usuario.IdCargo && (
          <small className="p-error">Cargo is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="Area" className="font-bold">
          Area
        </label>
        <Dropdown
          value={props.usuario.Area}
          onChange={(e) => {
            props.onDropdownChange(e, "IdArea", "Area");
          }}
          options={props.areas}
          optionLabel="Descripcion"
          filter
          placeholder="Seleccionar Area"
          className="w-full"
          showClear
        />
        {props.submitted && !props.usuario.IdArea && (
          <small className="p-error">Area is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="CodigoConfirmacion" className="font-bold">
          Codigo Confirmacion
        </label>
        <InputText
          id="CodigoConfirmacion"
          value={props.usuario.CodigoConfirmacion}
          onChange={(e) => props.onInputChange(e, "CodigoConfirmacion")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.CodigoConfirmacion,
          })}
        />
        {props.submitted && !props.usuario.CodigoConfirmacion && (
          <small className="p-error">CodigoConfirmacion is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="UrlBase" className="font-bold">
          Url Base
        </label>
        <InputText
          id="UrlBase"
          value={props.usuario.UrlBase}
          onChange={(e) => props.onInputChange(e, "UrlBase")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.UrlBase,
          })}
        />
        {props.submitted && !props.usuario.UrlBase && (
          <small className="p-error">UrlBase is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="FormatoFotoPerfil" className="font-bold">
          Formato Foto Perfil
        </label>
        <InputText
          id="FormatoFotoPerfil"
          value={props.usuario.FormatoFotoPerfil}
          onChange={(e) => props.onInputChange(e, "FormatoFotoPerfil")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.FormatoFotoPerfil,
          })}
        />
        {props.submitted && !props.usuario.FormatoFotoPerfil && (
          <small className="p-error">FormatoFotoPerfil is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="NombreFotoPerfil" className="font-bold">
          Nombre Foto Perfil
        </label>
        <InputText
          id="NombreFotoPerfil"
          value={props.usuario.NombreFotoPerfil}
          onChange={(e) => props.onInputChange(e, "NombreFotoPerfil")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.NombreFotoPerfil,
          })}
        />
        {props.submitted && !props.usuario.NombreFotoPerfil && (
          <small className="p-error">NombreFotoPerfil is required.</small>
        )}
      </div>

      <div className="field">
        <label htmlFor="UrlFotoPerfil" className="font-bold">
          Url Foto Perfil
        </label>
        <InputText
          id="UrlFotoPerfil"
          value={props.usuario.UrlFotoPerfil}
          onChange={(e) => props.onInputChange(e, "UrlFotoPerfil")}
          className={classNames({
            "p-invalid": props.submitted && !props.usuario.UrlFotoPerfil,
          })}
        />
        {props.submitted && !props.usuario.UrlFotoPerfil && (
          <small className="p-error">UrlFotoPerfil is required.</small>
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
