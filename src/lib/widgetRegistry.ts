import { BarChartWidget } from "@/components/widgets/BarChartWidget";
import { LineChartWidget } from "@/components/widgets/LineChartWidget";
import { TableWidget } from "@/components/widgets/TableWidget";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { ChatWidget } from "@/components/widgets/ChatWidget";
import type { WidgetDataProps } from "@/types";

type WidgetComponent = React.ComponentType<WidgetDataProps>;

export const widgetRegistry = new Map<string, WidgetComponent>([
  ["bar-chart", BarChartWidget],
  ["line-chart", LineChartWidget],
  ["table", TableWidget],
  ["calendar", CalendarWidget],
  ["chat", ChatWidget],
]);

export function registerWidget(type: string, component: WidgetComponent) {
  widgetRegistry.set(type, component);
}

export function getWidget(type: string): WidgetComponent | undefined {
  return widgetRegistry.get(type);
}
