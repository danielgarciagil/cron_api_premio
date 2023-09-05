import { exec } from 'child_process';

async function borrarCache(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    //todo colocar que solo me borre la carperta de google como tal
    //exec('sudo rm -rf /tmp/.com.google.Chrom*', (error, stdout, stderr) => {
    //Cambio el nombre ahora es asi
    exec('sudo rm -rf /tmp/.org.chromium.Chrom*', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export async function ejecutarBorradoCache(): Promise<string> {
  try {
    //await borrarCache();
    return 'Caché borrada exitosamente';
  } catch (error) {
    return `Error al borrar la caché:', ${error}`;
  }
}

export const id_fecha_hoy = (): number => {
  return new Date().getDay() + 1; //todo
};

export const convertirHoraExpresionCron = (hora: string): string => {
  // Desglosar la hora en componentes
  const [horaStr, minStr, segStr] = hora.split(':');
  const horaNum = parseInt(horaStr, 10);
  const minNum = parseInt(minStr, 10);
  const segNum = parseInt(segStr, 10);

  // Construir la expresión cron
  return `${segNum} ${minNum} ${horaNum} * * *`;
};

export const pausaBySeg = async (time: number) => {
  await new Promise((resolve) => setTimeout(resolve, time * 1000));
};
