import { IListService } from "../interfaces/IListService";
import { ServiceScope, HttpClient } from '@microsoft/sp-client-base';
import { ILoggingService } from "../interfaces/ILoggingService";
import { ServiceLocator } from '../ServiceLocator';

export class ListService implements IListService {

  private httpClient: HttpClient;
  private loggingService: ILoggingService;

  constructor(serviceScope: ServiceScope) {

    this.httpClient = new HttpClient(serviceScope);

    serviceScope.whenFinished(() => {
      this.loggingService = serviceScope.consume(ServiceLocator.LoggingServiceKey);
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