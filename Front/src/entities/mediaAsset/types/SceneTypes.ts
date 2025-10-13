export type SrtItem = {
  start: number;
  end: number;
  text: string;
};

export type ImageScene = {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: "image";
  text: string;
};
