import { Message } from "../../utils/Interfaces";

export interface FileEntity {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  parseoriginalname: string;
  path: string;
  size: number;
  url: string;
}

export interface FileRemove {
  PublicUrl: string;
}

export interface FileOut {
  message: Message;
  registro?: FileEntity;
}

export interface FilesOut {
  message: Message;
  registro?: FileEntity[];
}
