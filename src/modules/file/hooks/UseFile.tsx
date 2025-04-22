import axios from "axios";
import { VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { FILE } from "../service/FileService";
import { FileOut, FileRemove } from "../interfaces/FileInterface";

const UseFile = () => {
  let message = new Menssage();

  const create = async (
    // carpetaCreate: CarpetaCreate,
    formData: FormData
  ): Promise<FileOut | undefined> => {
    try {
      const file = await axios.post<FileOut>(
        `${VITE_API_URL_GDS + FILE.CREATE}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return file.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const remove = async (
    fileRemove: FileRemove
  ): Promise<FileOut | undefined> => {
    try {
      const file = await axios.post<FileOut>(
        `${VITE_API_URL_GDS + FILE.REMOVE}`,
        fileRemove
      );
      return file.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    create,
    remove,
  };
};

export default UseFile;
