/**
 * EventHandler - обработчик события формы
 * @see com._1c.g5.v8.dt.form.model.EventHandler
 */
export interface EventHandler {
  event: string;
  name: string;
}

export interface EventHandlerContainer {
  handlers?: EventHandler[];
}
