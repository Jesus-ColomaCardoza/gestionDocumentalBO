import {
  AreaCreate,
  AreaOut,
  AreasOut,
  AreaUpdate,
} from "../interfaces/AreaInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { AREA } from "../service/AreaService";
import { Menssage } from "../../utils/menssage";

const UseArea = () => {
  let message = new Menssage();

  const create = async (
    areaCreate: AreaCreate
  ): Promise<AreaOut | undefined> => {
    try {
      const area = await axios.post<AreaOut>(
        `${VITE_API_URL_GDS + AREA.CREATE}`,
        areaCreate
      );
      return area.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<AreasOut | undefined> => {
    try {
      const areas = await axios.post<AreasOut>(
        `${VITE_API_URL_GDS + AREA.FIND_ALL}`,
        filterBodyRequest
      );
      return areas.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<AreaOut | undefined> => {
    try {
      const area = await axios.get<AreaOut>(
        `${VITE_API_URL_GDS + AREA.FIND_ONE + id}`
      );
      return area.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    areaUpdate: AreaUpdate
  ): Promise<AreaOut | undefined> => {
    try {
      const area = await axios.patch<AreaOut>(
        `${VITE_API_URL_GDS + AREA.UPDATE + id}`,
        areaUpdate
      );
      return area.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<AreaOut | undefined> => {
    try {
      const area = await axios.post<AreaOut>(
        `${VITE_API_URL_GDS + AREA.REMOVE + id}`
      );
      return area.data;
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

export default UseArea;
