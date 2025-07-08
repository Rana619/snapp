import { Bot, Send, MoreHorizontal, Trash2, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WidgetDataProps, ChatbotData } from "@/types";

interface ChatWidgetProps extends WidgetDataProps {
  fullHeight?: boolean;
}

export function ChatWidget({ widget, data, fullHeight = false, cardHeight, cardWidth }: ChatWidgetProps) {
  const chatData = data as ChatbotData;

  if (fullHeight) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 overflow-y-auto">
          <div className="flex items-start space-x-2">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {chatData?.welcomeMessage || "How may I help you?"}
            </p>
          </div>
        </div>
        <div className="p-4 pt-3 border-t bg-white dark:bg-gray-900">
          <div className="flex space-x-2">
            <Input placeholder="Type your message..." className="flex-1 text-sm" />
            <Button size="sm" className="px-3">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card
      className="widget-card hover:shadow-lg transition-all duration-200 h-full flex flex-col"
      style={{
        height: cardHeight,
        width: cardWidth,
        // margin: "5px"
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-4 flex-shrink-0">
        <CardTitle className="text-lg font-semibold capitalize">{widget?.dataKey?.split("_").map((s)=> `${s} `)??"Chap"}</CardTitle>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Clear chat history")}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Chat settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-4 pt-0 flex flex-col">
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3 overflow-y-auto">
          <div className="flex items-start space-x-2">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {chatData?.welcomeMessage || "How may I help you?"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Input placeholder="Type here..." className="flex-1 text-sm" />
          <Button size="sm" className="px-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
