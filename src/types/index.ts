export interface TagFill {
  id: string;
  value: string;
}

export interface ButtonGroup {
  id: string;
  label: string;
  template: string;
  fills: Record<string, TagFill[]>;
}
