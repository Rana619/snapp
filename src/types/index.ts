export interface NavItem {
  icon?: string;
  label: string;
  route: string;
  description?: string;
  children?: NavItem[];
}

export interface LayoutConfig {
  header: {
    logoText: string;
    logoUrl: string;
    nav: NavItem[];
    userMenu: Array<{ icon?: string; label: string; route: string }>;
  };
  footer: {
    text: string;
    links: Array<{ label: string; route: string }>;
  };
  theme: {
    dark: {
      background: string;
      foreground: string;
    };
    light: {
      background: string;
      foreground: string;
    };
    font: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export interface Widget {
  type: "bar-chart" | "line-chart" | "table" | "calendar" | "chat";
  id: string;
  dataKey: string;
  xl: {
    size: {
      width: number;
      height: number;
    }
    position: {
      row: number;
      col: number;
      colSpan?: number;
      rowSpan?: number;
    };
  }
}

export interface PageConfig {
  title: string;
  layout: {
    type?: string;
    columns: number;
    gutter: number;
  };
  grid: {
    columns: number;
    rowHeight: number;
  }
  widgets: Widget[];
}

export interface WidgetDataProps {
  data: any;
  widget: Widget;
  cardHeight: string;
  cardWidth: string;
  getWidgetData:()=>Promise<any>
}
export interface KPIData {
  total: number;
  newThisMonth: number;
  active: number;
}
export interface SalesData {
  labels: string[];
  values: number[];
}

export interface OpportunityData {
  name: string;
  stage: string;
  value: string;
  expectedClose: string;
}

export interface CalendarEvent {
  title: string;
  date: string;
  type: string;
}

export interface ChatbotData {
  welcomeMessage: string;
  quickReplies: string[];
}