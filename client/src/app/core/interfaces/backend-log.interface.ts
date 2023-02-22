export interface IBackendLog {
  id: number;
  modeId: number;
  createdAt: string;
  mode: {
    id: number;
    name: string;
  };
}
