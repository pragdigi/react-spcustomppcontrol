import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-property-pane";

import * as strings from "ListItemsWebPartStrings";
import ListItems from "./components/ListItems";
import { PropertyPaneAsyncDropdown } from "../../controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown";
import { IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown";

import { update, get } from "@microsoft/sp-lodash-subset";
import { IListItemsWebPartProps } from "./IListItemWebPartProps";


export default class ListItemsWebPart extends BaseClientSideWebPart<
  IListItemsWebPartProps
> {
  private loadLists(): Promise<IDropdownOption[]> {
    return new Promise<IDropdownOption[]>(
      (
        resolve: (options: IDropdownOption[]) => void,
        reject: (error: any) => void
      ) => {
        setTimeout(() => {
          resolve([
            {
              key: "sharedDocuments",
              text: "Shared Documents"
            },
            {
              key: "myDocuments",
              text: "My Documents"
            }
          ]);
        }, 2000);
      }
    );
  }

  private onListChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(
      this.properties,
      propertyPath,
      (): any => {
        return newValue;
      }
    );
    // refresh web part
    this.render();
  }

  public render(): void {
    const element: React.ReactElement<
      IListItemsWebPartProps
    > = React.createElement(ListItems, {
      listName: this.properties.listName
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                new PropertyPaneAsyncDropdown("listName", {
                  label: strings.ListFieldLabel,
                  loadOptions: this.loadLists.bind(this),
                  onPropertyChange: this.onListChange.bind(this),
                  selectedKey: this.properties.listName
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
