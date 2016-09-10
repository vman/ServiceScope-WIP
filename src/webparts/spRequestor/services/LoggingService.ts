import { ILoggingService } from "../interfaces/ILoggingService";

export class LoggingService implements ILoggingService {

  public log(message: any){
      console.log(message);
  }

  public warn(message: any){
      console.warn(message);
  }

  public error(message: any){
    console.error(message);
  }
}