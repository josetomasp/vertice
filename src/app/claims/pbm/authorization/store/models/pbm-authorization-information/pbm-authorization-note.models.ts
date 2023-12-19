export interface PbmAuthorizationNote {
  noteId?: number;
  parentId?: number;
  comment: string;
  userId: string;
  userRole?: string;
  dateTimeCreated: string;
  userModified?: string;
  dateTimeModified?: string;
}
