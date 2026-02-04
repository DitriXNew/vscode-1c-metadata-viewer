/**
 * Данные layout для контрола в RowLayout
 * Порт из com._1c.g5.lwt.layouts.LightRowLayoutData
 */
export class RowLayoutData {
    /**
     * Фиксированная ширина (-1 = авто)
     */
    width: number = -1;

    /**
     * Фиксированная высота (-1 = авто)
     */
    height: number = -1;

    /**
     * Исключить из layout
     */
    exclude: boolean = false;

    constructor(options?: Partial<RowLayoutData>) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
