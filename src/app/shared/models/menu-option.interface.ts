export interface HealtheMenuOption {
  text: string;
  icon?: string;
  isHidden?: boolean;
  elementName?: string;

  action(param?: any): any;
}
