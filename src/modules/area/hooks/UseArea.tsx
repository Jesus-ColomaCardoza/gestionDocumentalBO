import { useState } from "react";
import { AreaInterface } from "../interfaces/AreaInterface";
import axios from "axios";

const UseArea = () => {
  //   const [dataAdd, setDataAdd] = useState(initialDatestoAdd);

  //   const [dataUpdate, setDataUpdate] = useState(initialDatestoUpdate);

  const [dataArea, setDataArea] = useState<AreaInterface[]>([]);

  const findAll = async () => {
    try {
      const areas = await axios.post<{ registro: AreaInterface[] }>(
        `http://localhost:5000/area/find_all`,
        {
          cantidad_max: "0",
          Language: "ES",
          filters: [
            {
              campo: "0",
              operador: "",
              tipo: "",
              valor1: "",
              valor2: "",
            },
          ],
        }
      );
      console.log(areas.data);

      setDataArea(areas.data.registro);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    dataArea,
    findAll,
  };
};

export default UseArea;
