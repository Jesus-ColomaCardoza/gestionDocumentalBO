/**
 * console.log() custom
 *
 * @param {any[]} args
 */
/*
\x1b[4m → Subrayado
\x1b[30m → Negro
\x1b[31m → Rojo
\x1b[32m → Verde
\x1b[33m → Amarillo
\x1b[34m → Azul
\x1b[35m → Magenta
\x1b[36m → Cian
\x1b[37m → Blanco
\x1b[0m → Reset (restablece el color)
*/
export const printLog = (...args: any[]) => {
  const stack = new Error().stack?.split("\n")[2]; // Captura la línea de la llamada
  const match = stack?.match(/\((.*):(\d+):\d+\)/); // Extrae archivo y número de línea
  if (match) {
    const file = match[1].split("/").pop(); // Nombre del archivo
    const line = match[2]; // Número de línea
    console.log("+" + `-`.repeat(100) + "+");
    console.log(
      `\x1b[36;4m[${file?.split("\\")[file.split("\\").length - 1]
      }:${line}]\x1b[0m ⬇ To access ctrl + click ⬇`
    );
    console.log(...args);
    console.log("+" + `-`.repeat(100) + "+");
  } else {
    console.log("[No Info]", ...args);
  }
};

export const formatDate = (value: Date | null): string => {
  if (!value) return '';
  return value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Lima",
  });
};


export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return `${sizeInKB.toFixed(2)} KB`;
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return `${sizeInMB.toFixed(2)} MB`;
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return `${sizeInGB.toFixed(2)} GB`;
  }
}
