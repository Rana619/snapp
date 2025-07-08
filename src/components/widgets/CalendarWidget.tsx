import { Calendar, MoreHorizontal, Eye, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from "react";
import CalendarComponent from "react-calendar"; // Import the react-calendar component
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import type { WidgetDataProps, CalendarEvent } from "@/types";

// Function to format events into a map for easier lookup by date
const formatEventsForCalendar = (events: CalendarEvent[]) => {
  const eventMap: { [key: string]: CalendarEvent[] } = {};

  events.forEach((event) => {
    const eventDate = new Date(event.date).toLocaleDateString();
    if (!eventMap[eventDate]) {
      eventMap[eventDate] = [];
    }
    eventMap[eventDate].push(event);
  });

  return eventMap;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export function CalendarWidget({ widget, data, cardHeight, cardWidth }: WidgetDataProps) {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarData, setCalendarData] = useState<CalendarEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [eventMap, setEventMap] = useState<{ [key: string]: CalendarEvent[] }>({});

  useEffect(() => {
    if (data && data.length > 0) {
      let finalData: CalendarEvent[] = []
      data.forEach((item: any) => {
        finalData.push({
          title: item.title,
          date: item.date,
          type: item.type,
        })
      })
      setUpcomingEvents(finalData ? finalData?.slice(0, 5) || [] : [])
      setEventMap(formatEventsForCalendar(finalData || []))
      setCalendarData(finalData);
    }
  }, [data])

  // Function to check if a date has events
  const hasEvents = (date: Date) => {
    const dateString = date.toLocaleDateString();
    return eventMap[dateString] && eventMap[dateString].length > 0;
  };

  // Get events for selected date
  const selectedDateEvents = eventMap[selectedDate.toLocaleDateString()] || [];

  return (
    <Card
      className="widget-card hover:shadow-lg transition-all duration-200 h-full flex flex-col"
      style={{
        height: cardHeight,
        width: cardWidth,
        // margin: "5px"
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3 flex-shrink-0">
        <CardTitle className="text-lg font-semibold capitalize hover:text-blue-600 hover:cursor-default ">{widget?.dataKey.split("_").map((s)=> `${s} `)}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowCalendar(!showCalendar)}>
                <Eye className="mr-2 h-4 w-4" />
                {showCalendar ? 'View List' : 'View Calendar'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("View all events")}>
                <Eye className="mr-2 h-4 w-4" />
                View All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Add new event")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-3 pt-0 overflow-hidden">
        {showCalendar ? (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <CalendarComponent
                onChange={(date) => setSelectedDate(date as Date)}
                value={selectedDate}
                className="w-full text-xs"
                tileClassName={({ date, view }) => {
                  if (view === 'month' && hasEvents(date)) {
                    return 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100';
                  }
                  return '';
                }}
              />
            </div>
            {selectedDateEvents.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Events for {selectedDate.toLocaleDateString()}:
                </p>
                <div className="space-y-1 max-h-16 overflow-y-auto">
                  {selectedDateEvents.map((event, index) => (
                    <div key={index} className="text-xs text-gray-800 dark:text-gray-200 truncate">
                      • {event.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto" >
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: CalendarEvent, index: number) => (
                <div className="space-y-2 mb-2" key={index}>
                  <div
                    key={index}
                    className="flex items-start space-x-2 p-2 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400 mt-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(event.date)} • {event.type}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 px-4 pb-4 pt-0 flex items-center justify-center flex-col" >
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}