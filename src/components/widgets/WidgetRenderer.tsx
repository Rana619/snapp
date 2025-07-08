import { memo, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { widgetRegistry } from "@/lib/widgetRegistry";
import type { Widget } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getWidgetData } from "@/api";
import { apiClient } from "@/lib/apiClient";

interface WidgetRendererProps {
  widget: Widget;
  data: any;
  cardHeight: string;
  cardWidth: string;
  getWidgetData:() => Promise<any>
}

function WidgetError({ error }: { error: Error }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Widget Error</h3>
      </div>
      <p className="text-gray-600 mb-4">There was an error loading this widget.</p>
      <p className="text-sm text-gray-500">{error.message}</p>
    </div>
  );
}

function WidgetContent({ widget, data, cardHeight, cardWidth,getWidgetData }: WidgetRendererProps) {
  const WidgetComponent = widgetRegistry.get(widget.type);

  if (!WidgetComponent) {
    throw new Error(`Unknown widget type: ${widget.type}`);
  }

  return <WidgetComponent data={data} widget={widget} cardHeight={cardHeight} cardWidth={cardWidth}
  getWidgetData={getWidgetData} />;
}

export const WidgetRenderer = memo(function WidgetRenderer({
  widget,
  cardHeight,
  cardWidth
}: {
  widget: Widget;
  cardHeight: string;
  cardWidth: string;
}) {
  // const { data: pageConfig, isLoading: pageLoading } = useQuery({
  //   queryKey: ["/api/data/view/widget", widget?.dataKey],
  //   queryFn: () => getWidgetData(widget?.dataKey),
  // });
  const [pageConfig,setPageConfig] = useState({});
const getWidgetData = async ()=>{
const response: any = await apiClient.get(`/data/view/${widget?.dataKey}`);
    const data = await response;
    setPageConfig(response);
    return data;
}
  useEffect(()=>{
    getWidgetData();
  },[])

  return (
    <ErrorBoundary FallbackComponent={WidgetError}>
      <WidgetContent
        widget={widget}
        data={pageConfig?.records}
        getWidgetData ={getWidgetData}
        cardHeight={cardHeight}
        cardWidth={cardWidth}
      />
    </ErrorBoundary>
  );
});
