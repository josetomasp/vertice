export interface ModalData {
  titleString: string;
  bodyHtml: string;
  affirmString: string;
  affirmClass?: string;
  minHeight?: string;
}

export interface ConfirmationModalData extends ModalData {
  denyString?: string;
  headerClass?: string;
}
