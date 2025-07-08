import React, { useState, useEffect } from "react";
import { Bot, Zap, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./card";

export function AICRMAnimation() {
  const [botPosition, setBotPosition] = useState({ x: 0, y: 0 });
  const [botRotation, setBotRotation] = useState(0);
  const [aiPulse, setAiPulse] = useState(false);
  const [chatBubbleVisible, setChatBubbleVisible] = useState(false);

  // Bot floating animation
  useEffect(() => {
    const floatInterval = setInterval(() => {
      setBotPosition({
        x: Math.sin(Date.now() / 2000) * 10,
        y: Math.cos(Date.now() / 3000) * 8,
      });
      setBotRotation(Math.sin(Date.now() / 4000) * 3);
    }, 50);

    return () => clearInterval(floatInterval);
  }, []);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAiPulse(true);
      setChatBubbleVisible(true);

      setTimeout(() => {
        setAiPulse(false);
        setChatBubbleVisible(false);
      }, 2000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-950 border-0 shadow-2xl relative overflow-hidden">
      <CardContent className="p-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-16 h-16 bg-black rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 bg-black rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-16 w-8 h-8 bg-black rounded-full animate-pulse delay-500"></div>
        </div>

        {/* Central Bot Character */}
        <div className="flex flex-col items-center justify-center text-center relative min-h-[300px]">
          {/* Animated Bot */}
          <div className="relative mb-6">
            <div
              className={`relative transition-all duration-300 ${
                aiPulse ? "scale-110" : "scale-100"
              }`}
              style={{
                transform: `translate(${botPosition.x}px, ${botPosition.y}px) rotate(${botRotation}deg)`,
              }}
            >
              {/* Bot Body */}
              <div className="relative">
                {/* Main Bot Container */}
                <div className="w-24 h-24 bg-black from-black-100 to-black-200 rounded-3xl flex items-center justify-center shadow-2xl relative">
                  {/* Bot Face */}
                  <div className="relative">
                    <Bot className="w-12 h-12 text-white" />
                    {/* Animated Eyes */}
                    <div className="absolute -top-2 -left-2 w-3 h-3 bg-white rounded-full animate-ping"></div>
                    <div className="absolute -top-2 right-2 w-3 h-3 bg-white rounded-full animate-ping delay-100"></div>
                  </div>

                  {/* Energy Ring */}
                  <div className="absolute inset-0 border-2 border-black-400 rounded-3xl animate-pulse"></div>

                  {/* Processing Indicator */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-black rounded-full flex items-center justify-center animate-bounce">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 -m-16">
                  {[0, 120, 240].map((angle, index) => (
                    <div
                      key={index}
                      className="absolute w-8 h-8 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-lg"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `
                          translate(-50%, -50%) 
                          rotate(${angle + Date.now() / 20}deg) 
                          translateY(-40px) 
                          rotate(-${angle + Date.now() / 20}deg)
                        `,
                        animationDelay: `${index * 0.5}s`,
                      }}
                    >
                      {index === 0 && (
                        <CheckCircle className="w-5 h-5 text-black-500" />
                      )}
                      {index === 1 && (
                        <TrendingUp className="w-5 h-5 text-black-500" />
                      )}
                      {index === 2 && (
                        <Zap className="w-5 h-5 text-black-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Title and Description */}

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your AI Assistant
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Smart automation for next-gen customer engagement and relationship
              intelligence.
            </p>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-3 gap-8 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
                24/7
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Always On
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 animate-pulse delay-300">
                95%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Accuracy
              </p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 animate-pulse delay-700">
                3.2x
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Faster</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
