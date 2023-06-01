export type DevicesType = {
  id: string;
  ip: string;
  title: string;
  userId: string;
  deviceId: string;
  lastActiveDate: string;
  expirationDate: number;
};

export class DevicesDBModel {
  constructor(
    public id: string,
    public ip: string,
    public title: string,
    public userId: string,
    public deviceId: string,
    public lastActiveDate: string,
    public expirationDate: number,
  ) {}
}
