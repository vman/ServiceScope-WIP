import { IListService } from "../interfaces/IListService";
import { ServiceScope, ServiceKey, HttpClient } from '@microsoft/sp-client-base';
import { ILoggingService } from "../interfaces/ILoggingService";
import { LoggingService } from "../services/LoggingService";

export class ListService implements IListService {

  private httpClient: HttpClient;
  private loggingService: ILoggingService;
  private loggingServiceKey: ServiceKey<ILoggingService>;

  constructor(serviceScope: ServiceScope) {

    this.httpClient = new HttpClient(serviceScope);

    //It would be nice to use the LogginService here by consuming it from the serviceScope object passed in from the contructor.
    //It will have to be instantiated by consuming it from the ServiceScope;

    serviceScope.whenFinished(() => {
      //It is not possible to consume a dependency by just using the unique name of the ServiceKey.
      //this.loggingService = serviceScope.consume("loggingservicekey");


      //So we have to resort to creating a ServiceKey<ILoggingService> object and using it to consume the ILoggingService dependency.
      //This also means that we have to use the LoggingService class here which means there is tight coupling between ListService and LoggingService classes.
      this.loggingServiceKey = ServiceKey.create<ILoggingService>("loggingservicekey", LoggingService);
      this.loggingService = serviceScope.consume(this.loggingServiceKey);
    });

  }

  public getLists(): Promise<JSON> {
    return this.httpClient.get(`/_api/web/lists`)
      .then((response: Response) => {
        this.loggingService.log(response);
        return response.json();

      }, ((error: any) => {
        this.loggingService.error(error);
      }));
  }
}