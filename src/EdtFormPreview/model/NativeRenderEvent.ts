// NativeRenderEvent - событие нативного рендеринга

import { NativeRenderEventType } from './types';

/**
 * NativeRenderEvent - событие нативного рендеринга
 */
export interface NativeRenderEvent {
    /** Тип события */
    type: NativeRenderEventType;
    
    /** Дескриптор окна */
    windowHandle: number;
    
    /** Начальная координата X */
    startX: number;
    
    /** Начальная координата Y */
    startY: number;
    
    /** Конечная координата X */
    endX: number;
    
    /** Конечная координата Y */
    endY: number;
}
