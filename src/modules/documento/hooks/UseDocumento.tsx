import {
  DocumentoCreate,
  DocumentoOut,
  DocumentosOut,
  DocumentoUpdate,
} from "../interfaces/DocumentoInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { DOCUMENTO } from "../service/DocumentoService";
import { Menssage } from "../../utils/menssage";

const UseDocumento = () => {
  let message = new Menssage();

  const create = async (
    documentoCreate: DocumentoCreate
  ): Promise<DocumentoOut | undefined> => {
    try {
      const documento = await axios.post<DocumentoOut>(
        `${VITE_API_URL_GDS + DOCUMENTO.CREATE}`,
        documentoCreate
      );
      return documento.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<DocumentosOut | undefined> => {
    try {
      const documentos = await axios.post<DocumentosOut>(
        `${VITE_API_URL_GDS + DOCUMENTO.FIND_ALL}`,
        filterBodyRequest
      );
      return documentos.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<DocumentoOut | undefined> => {
    try {
      const documento = await axios.get<DocumentoOut>(
        `${VITE_API_URL_GDS + DOCUMENTO.FIND_ONE + id}`
      );
      return documento.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    documentoUpdate: DocumentoUpdate
  ): Promise<DocumentoOut | undefined> => {
    try {
      const documento = await axios.patch<DocumentoOut>(
        `${VITE_API_URL_GDS + DOCUMENTO.UPDATE + id}`,
        documentoUpdate
      );
      return documento.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<DocumentoOut | undefined> => {
    try {
      const documento = await axios.post<DocumentoOut>(
        `${VITE_API_URL_GDS + DOCUMENTO.REMOVE + id}`
      );
      return documento.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    create,
    findAll,
    findOne,
    update,
    remove,
  };
};

export default UseDocumento;
