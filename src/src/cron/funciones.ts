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
