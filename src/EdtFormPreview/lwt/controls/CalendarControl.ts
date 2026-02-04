/**
 * Контрол Calendar - календарь / выбор даты
 * Порт из com._1c.g5.v8.dt.form.presentation.controls.desktop.CalendarDraw.java
 * и ICalendarColors.java
 */
import { LightControl } from '../core/LightControl';
import { Rectangle } from '../geometry/Rectangle';
import { Dimension } from '../geometry';
import { getTheme, ITheme, Color, Font } from '../theme';
import { CalendarStyles } from '../theme/ControlStyles';

// ============================================================================
// ТИПЫ
// ============================================================================

/**
 * Режим отображения календаря
 */
export enum CalendarViewMode {
    /** Дни месяца */
    Days = 'days',
    /** Месяцы года */
    Months = 'months',
    /** Годы */
    Years = 'years'
}

/**
 * Первый день недели
 */
export enum FirstDayOfWeek {
    Sunday = 0,
    Monday = 1
}

/**
 * Информация о дне
 */
export interface IDayInfo {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
    isHoliday: boolean;
    isSelected: boolean;
}

// ============================================================================
// КОНТРОЛ КАЛЕНДАРЯ
// ============================================================================

/**
 * Контрол календаря
 */
export class CalendarControl extends LightControl {
    // Текущие значения
    private _selectedDate: Date | null = null;
    private _displayMonth: number;
    private _displayYear: number;
    
    // Настройки
    private _viewMode: CalendarViewMode = CalendarViewMode.Days;
    private _firstDayOfWeek: FirstDayOfWeek = FirstDayOfWeek.Monday;
    private _showWeekNumbers: boolean = true;
    private _showOtherMonthDays: boolean = true;
    private _minDate: Date | null = null;
    private _maxDate: Date | null = null;
    
    // Праздники (Set дат в формате "YYYY-MM-DD")
    private _holidays: Set<string> = new Set();
    
    // Состояние
    private _hoveredDate: Date | null = null;
    private _hoveredNavButton: 'prev' | 'next' | 'monthYear' | null = null;
    
    // Размеры (вычисляемые)
    private _cellWidth: number = 32;
    private _cellHeight: number = 24;
    private _headerHeight: number = 30;
    private _weekdayHeight: number = 24;
    private _weekNumberWidth: number = 24;

    // Имена дней и месяцев
    private _dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    private _monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель',
        'Май', 'Июнь', 'Июль', 'Август',
        'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    private _shortMonthNames = [
        'Янв', 'Фев', 'Мар', 'Апр',
        'Май', 'Июн', 'Июл', 'Авг',
        'Сен', 'Окт', 'Ноя', 'Дек'
    ];

    constructor() {
        super();
        const now = new Date();
        this._displayMonth = now.getMonth();
        this._displayYear = now.getFullYear();
    }

    // ========================================================================
    // СВОЙСТВА
    // ========================================================================

    /** Выбранная дата */
    get selectedDate(): Date | null {
        return this._selectedDate;
    }

    set selectedDate(value: Date | null) {
        this._selectedDate = value;
        if (value) {
            this._displayMonth = value.getMonth();
            this._displayYear = value.getFullYear();
        }
        this.invalidate();
    }

    /** Отображаемый месяц (0-11) */
    get displayMonth(): number {
        return this._displayMonth;
    }

    set displayMonth(value: number) {
        if (value < 0) {
            this._displayMonth = 11;
            this._displayYear--;
        } else if (value > 11) {
            this._displayMonth = 0;
            this._displayYear++;
        } else {
            this._displayMonth = value;
        }
        this.invalidate();
    }

    /** Отображаемый год */
    get displayYear(): number {
        return this._displayYear;
    }

    set displayYear(value: number) {
        this._displayYear = value;
        this.invalidate();
    }

    /** Режим отображения */
    get viewMode(): CalendarViewMode {
        return this._viewMode;
    }

    set viewMode(value: CalendarViewMode) {
        this._viewMode = value;
        this.invalidate();
    }

    /** Первый день недели */
    get firstDayOfWeek(): FirstDayOfWeek {
        return this._firstDayOfWeek;
    }

    set firstDayOfWeek(value: FirstDayOfWeek) {
        this._firstDayOfWeek = value;
        
        // Перестроить массив дней
        if (value === FirstDayOfWeek.Sunday) {
            this._dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        } else {
            this._dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        }
        
        this.invalidate();
    }

    /** Показывать номера недель */
    get showWeekNumbers(): boolean {
        return this._showWeekNumbers;
    }

    set showWeekNumbers(value: boolean) {
        this._showWeekNumbers = value;
        this.invalidate();
    }

    /** Праздники */
    get holidays(): Set<string> {
        return this._holidays;
    }

    /**
     * Добавить праздник
     */
    addHoliday(date: Date): void {
        this._holidays.add(this.formatDateKey(date));
        this.invalidate();
    }

    /**
     * Удалить праздник
     */
    removeHoliday(date: Date): void {
        this._holidays.delete(this.formatDateKey(date));
        this.invalidate();
    }

    // ========================================================================
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // ========================================================================

    /**
     * Формат даты для ключа
     */
    private formatDateKey(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    /**
     * Является ли дата праздником
     */
    private isHoliday(date: Date): boolean {
        return this._holidays.has(this.formatDateKey(date));
    }

    /**
     * Является ли дата выходным (субб/воскр)
     */
    private isWeekend(date: Date): boolean {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    /**
     * Сравнить две даты (только день)
     */
    private isSameDay(d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    /**
     * Является ли дата сегодняшней
     */
    private isToday(date: Date): boolean {
        return this.isSameDay(date, new Date());
    }

    /**
     * Получить количество дней в месяце
     */
    private getDaysInMonth(year: number, month: number): number {
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * Получить день недели первого числа месяца (0 = понедельник при firstDayOfWeek=Monday)
     */
    private getFirstDayOffset(year: number, month: number): number {
        const firstDay = new Date(year, month, 1).getDay();
        
        if (this._firstDayOfWeek === FirstDayOfWeek.Monday) {
            return firstDay === 0 ? 6 : firstDay - 1;
        } else {
            return firstDay;
        }
    }

    /**
     * Получить номер недели
     */
    private getWeekNumber(date: Date): number {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    /**
     * Вычислить предпочтительный размер
     */
    calculatePreferredSize(): Dimension {
        const cols = 7 + (this._showWeekNumbers ? 1 : 0);
        const rows = 6;
        
        const width = cols * this._cellWidth + 2;
        const height = this._headerHeight + this._weekdayHeight + rows * this._cellHeight + 2;
        
        return new Dimension(width, height);
    }

    // ========================================================================
    // НАВИГАЦИЯ
    // ========================================================================

    /**
     * Предыдущий месяц
     */
    prevMonth(): void {
        this._displayMonth--;
        if (this._displayMonth < 0) {
            this._displayMonth = 11;
            this._displayYear--;
        }
        this.invalidate();
    }

    /**
     * Следующий месяц
     */
    nextMonth(): void {
        this._displayMonth++;
        if (this._displayMonth > 11) {
            this._displayMonth = 0;
            this._displayYear++;
        }
        this.invalidate();
    }

    /**
     * Перейти к сегодня
     */
    goToToday(): void {
        const now = new Date();
        this._displayMonth = now.getMonth();
        this._displayYear = now.getFullYear();
        this.invalidate();
    }

    // ========================================================================
    // ОТРИСОВКА
    // ========================================================================

    /**
     * Отрисовка календаря
     */
    paint(ctx: CanvasRenderingContext2D, clip: Rectangle): void {
        if (!this.visible || !this.bounds.intersects(clip)) {
            return;
        }

        const theme = getTheme();

        ctx.save();

        // Фон
        ctx.fillStyle = CalendarStyles.panelBackground.toCss();
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

        // Рамка
        ctx.strokeStyle = theme.inputBorder.toCss();
        ctx.lineWidth = 1;
        ctx.strokeRect(this.bounds.x + 0.5, this.bounds.y + 0.5, this.bounds.width - 1, this.bounds.height - 1);

        // Заголовок (месяц, год, стрелки)
        this.paintHeader(ctx);

        // Дни недели
        this.paintWeekdays(ctx);

        // Дни месяца
        if (this._viewMode === CalendarViewMode.Days) {
            this.paintDays(ctx);
        } else if (this._viewMode === CalendarViewMode.Months) {
            this.paintMonths(ctx);
        } else {
            this.paintYears(ctx);
        }

        ctx.restore();
    }

    /**
     * Отрисовка заголовка
     */
    private paintHeader(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const x = this.bounds.x + 1;
        const y = this.bounds.y + 1;
        const width = this.bounds.width - 2;

        // Фон заголовка
        ctx.fillStyle = CalendarStyles.headerBackground.toCss();
        ctx.fillRect(x, y, width, this._headerHeight);

        // Разделитель
        ctx.strokeStyle = theme.inputBorder.toCss();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y + this._headerHeight - 0.5);
        ctx.lineTo(x + width, y + this._headerHeight - 0.5);
        ctx.stroke();

        // Стрелка назад
        const arrowSize = 16;
        const arrowY = y + (this._headerHeight - arrowSize) / 2;
        
        ctx.fillStyle = this._hoveredNavButton === 'prev' ? 
            theme.buttonBackgroundHover.toCss() : 'transparent';
        ctx.fillRect(x + 4, arrowY, arrowSize, arrowSize);
        
        ctx.fillStyle = CalendarStyles.navButtonTextColor.toCss();
        ctx.beginPath();
        ctx.moveTo(x + 12, arrowY + 4);
        ctx.lineTo(x + 6, arrowY + arrowSize / 2);
        ctx.lineTo(x + 12, arrowY + arrowSize - 4);
        ctx.closePath();
        ctx.fill();

        // Стрелка вперед
        const rightArrowX = x + width - arrowSize - 4;
        
        ctx.fillStyle = this._hoveredNavButton === 'next' ? 
            theme.buttonBackgroundHover.toCss() : 'transparent';
        ctx.fillRect(rightArrowX, arrowY, arrowSize, arrowSize);
        
        ctx.fillStyle = CalendarStyles.navButtonTextColor.toCss();
        ctx.beginPath();
        ctx.moveTo(rightArrowX + 4, arrowY + 4);
        ctx.lineTo(rightArrowX + 10, arrowY + arrowSize / 2);
        ctx.lineTo(rightArrowX + 4, arrowY + arrowSize - 4);
        ctx.closePath();
        ctx.fill();

        // Месяц и год
        const font = theme.defaultFont;
        ctx.font = `bold ${font.size}px ${font.family}`;
        ctx.fillStyle = CalendarStyles.headerTitleTextColor.toCss();
        ctx.textAlign = 'center';
        
        const title = `${this._monthNames[this._displayMonth]} ${this._displayYear}`;
        const titleX = x + width / 2;
        const titleY = y + (this._headerHeight + font.size) / 2 - 2;
        
        // Подсветка при наведении
        if (this._hoveredNavButton === 'monthYear') {
            const titleWidth = ctx.measureText(title).width + 16;
            ctx.fillStyle = theme.buttonBackgroundHover.toCss();
            ctx.fillRect(titleX - titleWidth / 2, arrowY, titleWidth, arrowSize);
        }
        
        ctx.fillStyle = CalendarStyles.headerTitleTextColor.toCss();
        ctx.fillText(title, titleX, titleY);
        
        ctx.textAlign = 'left';
    }

    /**
     * Отрисовка дней недели
     */
    private paintWeekdays(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        let x = this.bounds.x + 1;
        const y = this.bounds.y + 1 + this._headerHeight;
        
        // Номера недель (заголовок столбца)
        if (this._showWeekNumbers) {
            ctx.fillStyle = CalendarStyles.weekNumberBackground.toCss();
            ctx.fillRect(x, y, this._weekNumberWidth, this._weekdayHeight);
            x += this._weekNumberWidth;
        }

        // Дни недели
        const font = theme.defaultFont;
        ctx.font = `${font.size}px ${font.family}`;
        
        for (let i = 0; i < 7; i++) {
            const dayX = x + i * this._cellWidth;
            
            // Фон
            ctx.fillStyle = CalendarStyles.weekDayBackground.toCss();
            ctx.fillRect(dayX, y, this._cellWidth, this._weekdayHeight);
            
            // Текст
            const isWeekend = (this._firstDayOfWeek === FirstDayOfWeek.Monday) ?
                (i >= 5) : (i === 0 || i === 6);
                
            ctx.fillStyle = isWeekend ? 
                CalendarStyles.weekendTextColor.toCss() : 
                CalendarStyles.weekDayTextColor.toCss();
            ctx.textAlign = 'center';
            ctx.fillText(
                this._dayNames[i], 
                dayX + this._cellWidth / 2, 
                y + (this._weekdayHeight + font.size) / 2 - 2
            );
        }
        
        ctx.textAlign = 'left';
    }

    /**
     * Отрисовка дней месяца
     */
    private paintDays(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const font = theme.defaultFont;
        ctx.font = `${font.size}px ${font.family}`;
        
        const startX = this.bounds.x + 1 + (this._showWeekNumbers ? this._weekNumberWidth : 0);
        const startY = this.bounds.y + 1 + this._headerHeight + this._weekdayHeight;
        
        const daysInMonth = this.getDaysInMonth(this._displayYear, this._displayMonth);
        const firstDayOffset = this.getFirstDayOffset(this._displayYear, this._displayMonth);
        
        // Предыдущий месяц
        const prevMonth = this._displayMonth === 0 ? 11 : this._displayMonth - 1;
        const prevYear = this._displayMonth === 0 ? this._displayYear - 1 : this._displayYear;
        const daysInPrevMonth = this.getDaysInMonth(prevYear, prevMonth);
        
        let dayIndex = 0;
        
        for (let row = 0; row < 6; row++) {
            // Номер недели
            if (this._showWeekNumbers) {
                const firstDayOfRow = this.getDateForCell(row, 0, firstDayOffset, daysInMonth, daysInPrevMonth);
                const weekNum = this.getWeekNumber(firstDayOfRow);
                
                const weekX = this.bounds.x + 1;
                const weekY = startY + row * this._cellHeight;
                
                ctx.fillStyle = CalendarStyles.weekNumberBackground.toCss();
                ctx.fillRect(weekX, weekY, this._weekNumberWidth, this._cellHeight);
                
                ctx.fillStyle = CalendarStyles.weekNumberTextColor.toCss();
                ctx.textAlign = 'center';
                ctx.fillText(
                    String(weekNum),
                    weekX + this._weekNumberWidth / 2,
                    weekY + (this._cellHeight + font.size) / 2 - 2
                );
            }
            
            // Дни
            for (let col = 0; col < 7; col++) {
                const date = this.getDateForCell(row, col, firstDayOffset, daysInMonth, daysInPrevMonth);
                const dayInfo = this.getDayInfo(date);
                
                this.paintDayCell(ctx, startX + col * this._cellWidth, startY + row * this._cellHeight, dayInfo);
                
                dayIndex++;
            }
        }
        
        ctx.textAlign = 'left';
    }

    /**
     * Получить дату для ячейки
     */
    private getDateForCell(row: number, col: number, firstDayOffset: number, daysInMonth: number, daysInPrevMonth: number): Date {
        const cellIndex = row * 7 + col;
        
        if (cellIndex < firstDayOffset) {
            // Предыдущий месяц
            const day = daysInPrevMonth - (firstDayOffset - cellIndex - 1);
            const month = this._displayMonth === 0 ? 11 : this._displayMonth - 1;
            const year = this._displayMonth === 0 ? this._displayYear - 1 : this._displayYear;
            return new Date(year, month, day);
        } else if (cellIndex >= firstDayOffset + daysInMonth) {
            // Следующий месяц
            const day = cellIndex - firstDayOffset - daysInMonth + 1;
            const month = this._displayMonth === 11 ? 0 : this._displayMonth + 1;
            const year = this._displayMonth === 11 ? this._displayYear + 1 : this._displayYear;
            return new Date(year, month, day);
        } else {
            // Текущий месяц
            return new Date(this._displayYear, this._displayMonth, cellIndex - firstDayOffset + 1);
        }
    }

    /**
     * Получить информацию о дне
     */
    private getDayInfo(date: Date): IDayInfo {
        return {
            date,
            day: date.getDate(),
            isCurrentMonth: date.getMonth() === this._displayMonth && date.getFullYear() === this._displayYear,
            isToday: this.isToday(date),
            isWeekend: this.isWeekend(date),
            isHoliday: this.isHoliday(date),
            isSelected: this._selectedDate ? this.isSameDay(date, this._selectedDate) : false
        };
    }

    /**
     * Отрисовка ячейки дня
     */
    private paintDayCell(ctx: CanvasRenderingContext2D, x: number, y: number, day: IDayInfo): void {
        const theme = getTheme();
        const font = theme.defaultFont;
        
        // Фон
        let bgColor: Color;
        if (day.isSelected) {
            bgColor = CalendarStyles.selectedDayBackground;
        } else if (this._hoveredDate && this.isSameDay(day.date, this._hoveredDate)) {
            bgColor = CalendarStyles.hoveredDayBackground;
        } else {
            bgColor = CalendarStyles.panelBackground;
        }
        
        ctx.fillStyle = bgColor.toCss();
        ctx.fillRect(x, y, this._cellWidth, this._cellHeight);
        
        // Рамка сегодняшнего дня
        if (day.isToday) {
            ctx.strokeStyle = CalendarStyles.todayBorderColor.toCss();
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y + 1, this._cellWidth - 2, this._cellHeight - 2);
        }
        
        // Текст дня
        let textColor: Color;
        if (!day.isCurrentMonth) {
            textColor = CalendarStyles.otherMonthTextColor;
        } else if (day.isSelected) {
            textColor = CalendarStyles.selectedDayTextColor;
        } else if (day.isToday) {
            textColor = CalendarStyles.todayTextColor;
        } else if (day.isHoliday) {
            textColor = CalendarStyles.holidayPenColor;
        } else if (day.isWeekend) {
            textColor = CalendarStyles.weekendTextColor;
        } else {
            textColor = theme.foreground;
        }
        
        ctx.fillStyle = textColor.toCss();
        ctx.textAlign = 'center';
        ctx.fillText(
            String(day.day),
            x + this._cellWidth / 2,
            y + (this._cellHeight + font.size) / 2 - 2
        );
    }

    /**
     * Отрисовка месяцев
     */
    private paintMonths(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const font = theme.defaultFont;
        ctx.font = `${font.size}px ${font.family}`;
        
        const startX = this.bounds.x + 1;
        const startY = this.bounds.y + 1 + this._headerHeight;
        const monthWidth = (this.bounds.width - 2) / 3;
        const monthHeight = (this.bounds.height - this._headerHeight - 2) / 4;
        
        for (let i = 0; i < 12; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = startX + col * monthWidth;
            const y = startY + row * monthHeight;
            
            // Подсветка при наведении
            // TODO: отслеживание наведения на месяц
            
            ctx.fillStyle = theme.foreground.toCss();
            ctx.textAlign = 'center';
            ctx.fillText(
                this._shortMonthNames[i],
                x + monthWidth / 2,
                y + (monthHeight + font.size) / 2 - 2
            );
        }
        
        ctx.textAlign = 'left';
    }

    /**
     * Отрисовка годов
     */
    private paintYears(ctx: CanvasRenderingContext2D): void {
        const theme = getTheme();
        const font = theme.defaultFont;
        ctx.font = `${font.size}px ${font.family}`;
        
        const startX = this.bounds.x + 1;
        const startY = this.bounds.y + 1 + this._headerHeight;
        const yearWidth = (this.bounds.width - 2) / 3;
        const yearHeight = (this.bounds.height - this._headerHeight - 2) / 4;
        
        const startYear = Math.floor(this._displayYear / 10) * 10 - 1;
        
        for (let i = 0; i < 12; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const x = startX + col * yearWidth;
            const y = startY + row * yearHeight;
            const year = startYear + i;
            
            const isCurrentDecade = i > 0 && i < 11;
            
            ctx.fillStyle = isCurrentDecade ? 
                theme.foreground.toCss() : 
                CalendarStyles.otherMonthTextColor.toCss();
            ctx.textAlign = 'center';
            ctx.fillText(
                String(year),
                x + yearWidth / 2,
                y + (yearHeight + font.size) / 2 - 2
            );
        }
        
        ctx.textAlign = 'left';
    }

    // ========================================================================
    // ОБРАБОТКА СОБЫТИЙ МЫШИ
    // ========================================================================

    /**
     * Получить область заголовка
     */
    private getHeaderRect(): Rectangle {
        return new Rectangle(
            this.bounds.x + 1,
            this.bounds.y + 1,
            this.bounds.width - 2,
            this._headerHeight
        );
    }

    /**
     * Получить дату по координатам
     */
    private getDateAtPoint(x: number, y: number): Date | null {
        const startX = this.bounds.x + 1 + (this._showWeekNumbers ? this._weekNumberWidth : 0);
        const startY = this.bounds.y + 1 + this._headerHeight + this._weekdayHeight;
        
        if (x < startX || y < startY) return null;
        
        const col = Math.floor((x - startX) / this._cellWidth);
        const row = Math.floor((y - startY) / this._cellHeight);
        
        if (col < 0 || col >= 7 || row < 0 || row >= 6) return null;
        
        const daysInMonth = this.getDaysInMonth(this._displayYear, this._displayMonth);
        const firstDayOffset = this.getFirstDayOffset(this._displayYear, this._displayMonth);
        const daysInPrevMonth = this.getDaysInMonth(
            this._displayMonth === 0 ? this._displayYear - 1 : this._displayYear,
            this._displayMonth === 0 ? 11 : this._displayMonth - 1
        );
        
        return this.getDateForCell(row, col, firstDayOffset, daysInMonth, daysInPrevMonth);
    }

    /**
     * Обработка движения мыши
     */
    onMouseMove(x: number, y: number): void {
        // Проверка кнопок навигации
        const headerRect = this.getHeaderRect();
        let newHoveredNav: 'prev' | 'next' | 'monthYear' | null = null;
        
        if (headerRect.contains(x, y)) {
            const arrowSize = 16;
            const leftArrowX = headerRect.x + 4;
            const rightArrowX = headerRect.x + headerRect.width - arrowSize - 4;
            const arrowY = headerRect.y + (this._headerHeight - arrowSize) / 2;
            
            if (x >= leftArrowX && x <= leftArrowX + arrowSize && 
                y >= arrowY && y <= arrowY + arrowSize) {
                newHoveredNav = 'prev';
            } else if (x >= rightArrowX && x <= rightArrowX + arrowSize &&
                       y >= arrowY && y <= arrowY + arrowSize) {
                newHoveredNav = 'next';
            } else if (x > leftArrowX + arrowSize && x < rightArrowX) {
                newHoveredNav = 'monthYear';
            }
        }
        
        if (this._hoveredNavButton !== newHoveredNav) {
            this._hoveredNavButton = newHoveredNav;
            this.invalidate();
        }
        
        // Проверка дней
        const date = this.getDateAtPoint(x, y);
        if (date !== this._hoveredDate) {
            this._hoveredDate = date;
            this.invalidate();
        }
    }

    /**
     * Обработка ухода мыши
     */
    onMouseLeave(): void {
        if (this._hoveredDate !== null || this._hoveredNavButton !== null) {
            this._hoveredDate = null;
            this._hoveredNavButton = null;
            this.invalidate();
        }
    }

    /**
     * Обработка клика
     */
    onClick(x: number, y: number): void {
        // Клик на кнопки навигации
        if (this._hoveredNavButton === 'prev') {
            if (this._viewMode === CalendarViewMode.Days) {
                this.prevMonth();
            } else if (this._viewMode === CalendarViewMode.Months) {
                this._displayYear--;
                this.invalidate();
            } else {
                this._displayYear -= 10;
                this.invalidate();
            }
            return;
        }
        
        if (this._hoveredNavButton === 'next') {
            if (this._viewMode === CalendarViewMode.Days) {
                this.nextMonth();
            } else if (this._viewMode === CalendarViewMode.Months) {
                this._displayYear++;
                this.invalidate();
            } else {
                this._displayYear += 10;
                this.invalidate();
            }
            return;
        }
        
        if (this._hoveredNavButton === 'monthYear') {
            // Переключение режима просмотра
            if (this._viewMode === CalendarViewMode.Days) {
                this._viewMode = CalendarViewMode.Months;
            } else if (this._viewMode === CalendarViewMode.Months) {
                this._viewMode = CalendarViewMode.Years;
            } else {
                this._viewMode = CalendarViewMode.Days;
            }
            this.invalidate();
            return;
        }
        
        // Клик на день
        if (this._viewMode === CalendarViewMode.Days) {
            const date = this.getDateAtPoint(x, y);
            if (date) {
                this._selectedDate = date;
                
                // Если клик на дне другого месяца - переключиться
                if (date.getMonth() !== this._displayMonth) {
                    this._displayMonth = date.getMonth();
                    this._displayYear = date.getFullYear();
                }
                
                this.invalidate();
            }
        }
    }
}
