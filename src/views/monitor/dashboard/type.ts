interface ITopResp {
  pv: number,
  uv: number,
  pvhb: number,
  uvhb: number
}

interface ITrendData {
  lable: string;
  pv: number;
  uv: number;
}

export interface IPvUvInfo {
  startTime: string;
  endTime: string;
  topResp: ITopResp;
  allTrend: ITrendData[],
  org: ITrendData[],
  module: ITrendData[]
}
