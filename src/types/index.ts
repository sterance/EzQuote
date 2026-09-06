export interface ButtonGroup {
  id: string;
  label: string;
  template: string;
  fills: Record<string, string[]>;
  fillIds: Record<string, string[]>;
}
