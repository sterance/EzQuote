export interface ButtonGroup {
  id: string;
  label: string;
  template: string;
  fills: Record<string, Array<{ id: string; text: string; starred: boolean }>>;
}
