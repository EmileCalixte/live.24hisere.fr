export interface AdminDisabledAppResponse {
    isAppEnabled: boolean;
    disabledAppMessage: string | null;
}

export interface AdminPassageImportSettingsResponse {
    dagFileUrl: string | null;
}
