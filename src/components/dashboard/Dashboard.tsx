import { useQuery } from "@tanstack/react-query";
import { fetchPageConfig, fetchPageConfigNew, fetchWidgetData } from "@/api";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageConfig, Widget } from "@/types";
import DraggableWidgetWrapper from "./DraggableWidgetWrapper";
import { useEffect, useMemo, useState } from "react";
import { set } from "date-fns";
import { count } from "console";
import { useSelector } from "react-redux";
import { RootState } from "@/types/store.type";

interface DashboardProps {
  slug: string;
}
interface DraggableWidgetData extends Widget {
  _id: number;
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 min-h-[200px]">
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-32 w-full" />
        </div>
      ))}
    </div>
  );
}

export function Dashboard({ slug }: DashboardProps) {
  const userData = useSelector((state: RootState) => state.user)
  const [widgetList, setWidgetList] = useState<DraggableWidgetData[]>([]);

  const { data: pageConfig, isLoading: pageLoading } = useQuery({
    queryKey: ["/api/page-config", slug],
    queryFn: () => fetchPageConfigNew(slug),
  });

  const wholeData = useQuery({
    queryKey: ["/api/page-config", slug],
    queryFn: () => fetchPageConfigNew(slug),
  });

  const { data: widgetData, isLoading: dataLoading } = useQuery({
    queryKey: ["/api/widget-data", pageConfig?.widgets.map((w) => w.dataKey), "dashboard"],
    queryFn: () =>
      fetchWidgetData(pageConfig?.widgets.map((w) => w.dataKey) || [], true),
    enabled: !!pageConfig,
  });

  const widgetsWithId = useMemo(() => {
    if (!pageConfig?.widgets) return [];
    return pageConfig.widgets.map((widget, index) => ({
      ...widget,
      _id: index,
    }));
  }, [pageConfig?.widgets]);


  useEffect(() => {
    if (widgetsWithId.length > 0 && widgetList.length === 0) {
      setWidgetList(widgetsWithId);
    }
  }, [widgetsWithId, widgetList.length]);

  // const moveWidgets = (fromIndex: number, toIndex: number) => {
  //       const updated = [...widgetList];
  //   const [moved] = updated.splice(fromIndex, 1);
  //   updated.splice(toIndex, 0, moved);
  //   setWidgetList(updated);
  //     }
  const moveWidgets = (fromIndex: number, toIndex: number) => {
    const updated = [...widgetList];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    // Update grid positions to match new array order
    let Itemcount = 1;
    let SecondRowCount = 1;
    updated.forEach((widget, index) => {
      if (Itemcount <= 4) {
        widget.xl.position.col = Itemcount;
        widget.xl.position.row = 1;
        Itemcount++;
      } else {
        widget.xl.position.col = SecondRowCount;
        widget.xl.position.row = 3;
        SecondRowCount++;
      }
    });

    setWidgetList(updated);
  };
  const rowHeightTailwind = `auto-rows-[${pageConfig?.grid?.rowHeight ?? 250}px]`
  const columnsTailwind = `grid-cols-${pageConfig?.grid?.columns ?? 12}`;

  if (pageLoading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto  sm:px-2 lg:px-2 w-full">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <DashboardSkeleton />
      </main>
    );
  }

  if (!pageConfig) {
    return (
      <main className="flex-1 max-w-7xl mx-auto sm:px-2 lg:px-2 w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 mt-2">
            The requested dashboard configuration could not be found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 mx-auto px-4 sm:px-4 lg:px-4 w-full">
      {/* Page Header */}
      <div className="pb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {pageConfig.title}
          </h1>
        </div>
      </div>

      {/* Widget Grid */}
      {dataLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className={`grid ${columnsTailwind} gap-4 sm:gap-3 ${rowHeightTailwind}`}>
          {widgetList.map((widget, index) => {
            return <DraggableWidgetWrapper moveWidgets={moveWidgets} id={widget.id} index={index} key={widget.id}
              width={(widget.xl?.size?.width || 4)}
              column={(pageConfig?.grid?.columns || 12)}
              height={(widget.xl?.size?.height || 1)}
              isAdmin={userData?.user?.roles.includes("admin")}
            >
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                cardWidth="100%"
                cardHeight="100%"
              />
            </DraggableWidgetWrapper>
          })}
        </div>
      )}
    </main>
  );
}
