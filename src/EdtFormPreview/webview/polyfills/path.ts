/**
 * Заглушка для модуля path (упрощённая реализация для браузера)
 */
export function join(...paths: string[]): string {
    return paths.join('/').replace(/\/+/g, '/');
}

export function resolve(...paths: string[]): string {
    return join(...paths);
}

export function dirname(path: string): string {
    const lastSlash = path.lastIndexOf('/');
    return lastSlash > 0 ? path.substring(0, lastSlash) : '/';
}

export function basename(path: string, ext?: string): string {
    let name = path.split('/').pop() || '';
    if (ext && name.endsWith(ext)) {
        name = name.substring(0, name.length - ext.length);
    }
    return name;
}

export function extname(path: string): string {
    const base = basename(path);
    const lastDot = base.lastIndexOf('.');
    return lastDot > 0 ? base.substring(lastDot) : '';
}

export const posix = {
    join,
    resolve,
    dirname,
    basename,
    extname,
    sep: '/'
};

export default {
    join,
    resolve,
    dirname,
    basename,
    extname,
    posix,
    sep: '/'
};
