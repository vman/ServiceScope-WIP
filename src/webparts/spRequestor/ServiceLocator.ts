import { ServiceScope, ServiceKey } from '@microsoft/sp-client-base';
import { IListService } from './interfaces/IListService';
import { ListService } from './services/ListService';
import { ILoggingService } from "./interfaces/ILoggingService";
import { LoggingService } from "./services/LoggingService";

export class ServiceLocator {

  public static serviceScope: ServiceScope;
  public static ListServiceKey: ServiceKey<IListService>;
  public static LoggingServiceKey: ServiceKey<ILoggingService>;

  public static Init(){
    this.serviceScope = ServiceScope.startNewRoot();
    this.ListServiceKey = ServiceKey.create<IListService>("listservicekey", ListService);
    this.LoggingServiceKey = ServiceKey.create<ILoggingService>("loggingservicekey", LoggingService);
    this.serviceScope.finish();
  }

  public static getServiceInstance<T>(serviceKey: ServiceKey<T>): T {
      return this.serviceScope.consume(serviceKey);
  }
}