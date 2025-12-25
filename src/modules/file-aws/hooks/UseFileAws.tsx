import {
  FileManagerAws,
  FileManagerAwsOut,
  FileManagersAwsOut,
} from "../interfaces/FileAwsInterface";
import axios from "axios";
import { VITE_API_URL_GDS } from "../../utils/Constants";
import { FILE_MANAGER } from "../service/FileAwsService";
import { Menssage } from "../../utils/menssage";

const UseFileAws = () => {
  let message = new Menssage();

  const create = async (
    // documentoCreate: DocumentoCreate,
    formData: FormData
  ): Promise<FileManagerAwsOut | undefined> => {
    try {
      const documento = await axios.post<FileManagerAwsOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.CREATE}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return documento.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAllByArea = async (
    fileManagerAws: FileManagerAws
  ): Promise<FileManagersAwsOut | undefined> => {
    try {
      const fileManagers = await axios.post<FileManagersAwsOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.FIND_ALL_BY_AREA}`,
        fileManagerAws
      );
      return fileManagers.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<FileManagerAwsOut | undefined> => {
    try {
      const documento = await axios.post<FileManagerAwsOut>(
        `${VITE_API_URL_GDS + FILE_MANAGER.REMOVE + id}`
      );
      return documento.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    findAllByArea,
    create,
    remove,
  };
};

export default UseFileAws;
