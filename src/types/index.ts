export interface ChildOption {
  id: string;
  label: string;
  fills: Record<string, string>;
}

export interface ButtonGroup {
  id: string;
  label: string;
  template: string;
  buttons: ChildOption[];
}
