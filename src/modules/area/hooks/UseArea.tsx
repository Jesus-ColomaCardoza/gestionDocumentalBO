import { useState } from "react";
import { AreaInterface } from "../interfaces/AreaInterface";
import axios from "axios";
import { filterBodyRequest, VITE_API_URL_GDS } from "../../utils/Constants";
import { AREA } from "../service/AreaService";

const UseArea = () => {
  const [dataArea, setDataArea] = useState<AreaInterface[]>([]);

  const findAll = async () => {
    try {
      const areas = await axios.post<{ registro: AreaInterface[] }>(
        `${VITE_API_URL_GDS+AREA.FIND_ALL}`,
        filterBodyRequest
      );
      console.log(areas.data);

      setDataArea(areas.data.registro);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    dataArea,
    setDataArea,
    findAll,
  };
};

export default UseArea;
