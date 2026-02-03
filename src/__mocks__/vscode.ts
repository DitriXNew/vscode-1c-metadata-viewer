// Мок модуля vscode для тестирования
export const window = {
    showErrorMessage: () => {},
    showInformationMessage: () => {},
    createWebviewPanel: () => ({
        webview: { html: '' }
    }),
};

export const Uri = {
    file: (path: string) => ({ fsPath: path }),
    joinPath: (...args: any[]) => ({ fsPath: args.join('/') }),
};

export const ViewColumn = {
    One: 1,
    Two: 2,
};

export default {
    window,
    Uri,
    ViewColumn,
};
