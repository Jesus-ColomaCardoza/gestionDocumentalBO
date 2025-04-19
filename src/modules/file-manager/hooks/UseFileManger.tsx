import {
  FileManagerGetFilesArea,
  FileManagerGetMyFiles,
  FileManagerOut,
  FileManagersOut,
} from "../interfaces/FileMangerInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { FILE_MANAGER } from "../service/FileMangerService";
import { Menssage } from "../../utils/menssage";
import {
  CarpetaCreate,
  CarpetaUpdate,
} from "../../carpeta/interfaces/CarpetaInterface";
import {
  DocumentoCreate,
  DocumentoUpdate,
} from "../../documento/interfaces/DocumentoInterface";

const UseFileManager = () => {
  let message = new Menssage();

  const createCarpeta = async (
    carpetaCreate: CarpetaCreate
  ): Promise<FileManagerOut | undefined> => {
    try {
      const carpeta = await axios.post<FileManagerOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.CREATE_CARPETA}`,
        carpetaCreate
      );
      return carpeta.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const createDocumento = async (
    documentoCreate: DocumentoCreate
  ): Promise<FileManagerOut | undefined> => {
    try {
      const documento = await axios.post<FileManagerOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.CREATE_DOCUMENTO}`,
        documentoCreate
      );
      return documento.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<FileManagersOut | undefined> => {
    try {
      const fileManagers = await axios.post<FileManagersOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.FIND_ALL}`,
        filterBodyRequest
      );
      return fileManagers.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findAllMyFiles = async (
    fileManagerGetMyFiles: FileManagerGetMyFiles
  ): Promise<FileManagersOut | undefined> => {
    try {
      const fileManagers = await axios.post<FileManagersOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.FIND_ALL_MY_FILES}`,
        fileManagerGetMyFiles
      );
      return fileManagers.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findAllFilesArea = async (
    FileManagerGetFilesArea: FileManagerGetFilesArea
  ): Promise<FileManagersOut | undefined> => {
    try {
      const fileManagers = await axios.post<FileManagersOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.FIND_ALL_FILES_AREA}`,
        FileManagerGetFilesArea
      );
      return fileManagers.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<FileManagerOut | undefined> => {
    try {
      const fileManager = await axios.get<FileManagerOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.FIND_ONE + id}`
      );
      return fileManager.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateCarpeta = async (
    id: string,
    carpetaUpdate: CarpetaUpdate
  ): Promise<FileManagerOut | undefined> => {
    try {
      const carpeta = await axios.patch<FileManagerOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.UPDATE_CARPETA + id}`,
        carpetaUpdate
      );
      return carpeta.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateDocumento = async (
    id: string,
    documentoUpdate: DocumentoUpdate
  ): Promise<FileManagerOut | undefined> => {
    try {
      const documento = await axios.patch<FileManagerOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.UPDATE_DOCUMENTO + id}`,
        documentoUpdate
      );
      return documento.data;
    } catch (error) {
      console.log(error);
    }
  };

  const removeCarpeta = async (
    id: string
  ): Promise<FileManagerOut | undefined> => {
    try {
      const carpeta = await axios.post<FileManagerOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.REMOVE_CARPETA + id}`
      );
      return carpeta.data;
    } catch (error) {
      console.log(error);
    }
  };

  const removeDocumento = async (
    id: string
  ): Promise<FileManagerOut | undefined> => {
    try {
      const documento = await axios.post<FileManagerOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.REMOVE_DOCUMENTO + id}`
      );
      return documento.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createCarpeta,
    createDocumento,
    findAll,
    findAllMyFiles,
    findAllFilesArea,
    findOne,
    updateCarpeta,
    updateDocumento,
    removeCarpeta,
    removeDocumento,
  };
};

export default UseFileManager;
