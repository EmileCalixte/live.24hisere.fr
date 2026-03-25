export interface DisabledAppData {
  isAppEnabled: boolean;

  disabledAppMessage: string | null;
}

export interface GlobalInformationMessageData {
  isGlobalInformationMessageVisible: boolean;

  globalInformationMessage: string | null;
}

export interface PassageImportSettings {
  dagFileUrl: string | null;
}
