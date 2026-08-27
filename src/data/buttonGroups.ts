export interface ButtonOption {
  id: string;
  label: string;
  fills: Record<string, string>;
}

export interface ButtonGroupConfig {
  id: string;
  label: string;
  template: string;
  options: ButtonOption[];
}

export const buttonGroups: ButtonGroupConfig[] = [];
