export interface ColumnMeta {
  field: string;
  header: string;
  dataType?: 'text' | 'numeric' | 'date' | string | undefined;
  width: string;
  show: boolean;
  filterPlaceholder?:string,
}

export interface Message {
  msgId: number;
  msgTxt: string;
}

export interface ErrorOut {
  message : Message;
}