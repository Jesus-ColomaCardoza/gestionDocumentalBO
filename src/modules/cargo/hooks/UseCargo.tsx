import {
  CargoCreate,
  CargoOut,
  CargosOut,
  CargoUpdate,
} from "../interfaces/CargoInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { Menssage } from "../../utils/menssage";
import { CARGO } from "../service/CargoService";

const UseCargo = () => {
  let message = new Menssage();

  const create = async (
    cargoCreate: CargoCreate
  ): Promise<CargoOut | undefined> => {
    try {
      const cargo = await axios.post<CargoOut>(
        `${VITE_API_URL_GDS + CARGO.CREATE}`,
        cargoCreate
      );
      return cargo.data;
    } catch (error: any) {
      console.log(error);
      message.setMessage(1, "Error: Error interno en el servidor");
      return { message: message };
    }
  };

  const findAll = async (): Promise<CargosOut | undefined> => {
    try {
      const cargos = await axios.post<CargosOut>(
        `${VITE_API_URL_GDS + CARGO.FIND_ALL}`,
        filterBodyRequest
      );
      return cargos.data;
    } catch (error) {
      console.log(error);
    }
  };

  const findOne = async (id: string): Promise<CargoOut | undefined> => {
    try {
      const cargo = await axios.get<CargoOut>(
        `${VITE_API_URL_GDS + CARGO.FIND_ONE + id}`
      );
      return cargo.data;
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (
    id: string,
    cargoUpdate: CargoUpdate
  ): Promise<CargoOut | undefined> => {
    try {
      const cargo = await axios.patch<CargoOut>(
        `${VITE_API_URL_GDS + CARGO.UPDATE + id}`,
        cargoUpdate
      );
      return cargo.data;
    } catch (error) {
      console.log(error);
    }
  };

  const remove = async (id: string): Promise<CargoOut | undefined> => {
    try {
      const cargo = await axios.post<CargoOut>(
        `${VITE_API_URL_GDS + CARGO.REMOVE + id}`
      );
      return cargo.data;
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

export default UseCargo;
