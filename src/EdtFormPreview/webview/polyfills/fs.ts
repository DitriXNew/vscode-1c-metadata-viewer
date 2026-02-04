/**
 * Заглушка для модуля fs (не используется в WebView)
 */
export function existsSync(_path: string): boolean {
    return false;
}

export function readFileSync(_path: string, _encoding?: string): string {
    throw new Error('fs.readFileSync is not available in browser');
}

export default {
    existsSync,
    readFileSync
};
