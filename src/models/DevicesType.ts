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
