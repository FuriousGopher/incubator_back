export type LogsType = {
  ip: string;
  endpoint: string;
  firstAttempt: number;
  lastAttempt: number;
  attemptsCount: number;
};

export class LogsDBModel {
  constructor(
    public ip: string,
    public endpoint: string,
    public firstAttempt: string,
    public lastAttempt: string,
    public attemptsCount: string,
  ) {}
}
