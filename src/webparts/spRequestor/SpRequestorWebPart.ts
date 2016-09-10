import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField
} from '@microsoft/sp-client-preview';

import styles from './SpRequestor.module.scss';
import * as strings from 'spRequestorStrings';
import { ISpRequestorWebPartProps } from './ISpRequestorWebPartProps';

import { ServiceScope, ServiceKey } from '@microsoft/sp-client-base';
import { IListService } from './interfaces/IListService';
import { ListService } from './services/ListService';
import { ILoggingService } from "./interfaces/ILoggingService";
import { LoggingService } from "./services/LoggingService";

export default class SpRequestorWebPart extends BaseClientSideWebPart<ISpRequestorWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.spRequestor}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${this.properties.description}</p>
              <a href="https://github.com/SharePoint/sp-dev-docs/wiki" class="ms-Button ${styles.button}">
                <span class="ms-Button-label">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;

    //Creating the ServiceScope and registering the mappings
    const serviceScope: ServiceScope = ServiceScope.startNewRoot();
    const listServiceKey: ServiceKey<IListService> = ServiceKey.create<IListService>("listservicekey", ListService);
    const loggingServiceKey: ServiceKey<ILoggingService> = ServiceKey.create<ILoggingService>("loggingservicekey", LoggingService);
    serviceScope.finish();

    //Consuming from the ServiceScope here works fine as the ServiceKeys are readily available.
    //But it is not so easy from inside one of these classes. Please go to ListService class to see the example.
    const listServiceInstance: IListService = serviceScope.consume(listServiceKey);
    const loggingServiceInstance: ILoggingService = serviceScope.consume(loggingServiceKey);

    listServiceInstance.getLists().then((response: JSON) => {
      loggingServiceInstance.log(response);
    });
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
