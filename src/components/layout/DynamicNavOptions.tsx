import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, BarChart3, Users, Target, FileText, Settings } from 'lucide-react';
import { useLocation } from "wouter";

interface NavigationItem {
    icon?: string;
    label: string;
    route: string;
    children?: NavigationItem[];
}

interface HorizontalNavbarProps {
    navigationItems?: NavigationItem[];
    onNavigate?: (route: string, label: string) => void;
}

const getIcon = (iconName?: string): React.ReactNode => {
    const iconProps = { className: "w-4 h-4" };
    switch (iconName) {
        case 'dashboard':
            return <BarChart3 {...iconProps} />;
        case 'accounts':
            return <Users {...iconProps} />;
        case 'opportunities':
            return <Target {...iconProps} />;
        case 'reports':
            return <FileText {...iconProps} />;
        case 'settings':
            return <Settings {...iconProps} />;
        default:
            return null;
    }
};

const DynamicNavOptions: React.FC<HorizontalNavbarProps> = ({
    navigationItems = [],
    onNavigate
}) => {
    const [location, navigate] = useLocation();
    const [activeDropdowns, setActiveDropdowns] = useState<Set<string>>(new Set());
    const [clickedItem, setClickedItem] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (itemRoute: string, level: number = 0): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setActiveDropdowns(prev => {
            const newSet = new Set(prev);
            if (level === 0) {
                navigationItems.forEach(item => {
                    if (item.route !== itemRoute) {
                        newSet.delete(item.route);
                        clearSubItems(item, newSet);
                    }
                });
            }
            newSet.add(itemRoute);
            return newSet;
        });
    };

    const clearSubItems = (item: NavigationItem, activeSet: Set<string>): void => {
        if (item.children) {
            item.children.forEach(child => {
                activeSet.delete(`sub-${child.route}`);
                clearSubItems(child, activeSet);
            });
        }
    };

    const handleMouseLeave = (itemRoute: string): void => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdowns(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemRoute);
                return newSet;
            });
        }, 300);
    };

    const handleItemClick = (item: NavigationItem): void => {
        setClickedItem(item.route);
        setTimeout(() => setClickedItem(null), 200);

        if (item.route) {
            navigate(item.route)
        }
        setActiveDropdowns(new Set());
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const renderSubMenu = (items: NavigationItem[], level: number = 1, parentRoute: string | null = null): React.ReactNode => {
        return (
            <div
                className={`bg-white dark:bg-[#081028] background rounded-lg shadow-xl py-2 min-w-[220px] z-50 ${level === 1 ? '' : 'absolute top-0 left-full'}`}
                onMouseEnter={() => {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const { clientX, clientY } = e;

                    const buffer = 10;
                    const isOutsideBuffer = (
                        clientX < rect.left - buffer ||
                        clientX > rect.right + buffer ||
                        clientY < rect.top - buffer ||
                        clientY > rect.bottom + buffer
                    );

                    if (isOutsideBuffer && level === 1 && parentRoute) {
                        handleMouseLeave(parentRoute);
                    } else if (isOutsideBuffer && level > 1 && parentRoute) {
                        timeoutRef.current = setTimeout(() => {
                            setActiveDropdowns(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(parentRoute);
                                return newSet;
                            });
                        }, 200);
                    }
                }}
            >
                <ul>
                    {items.map((item) => (
                        <li key={item.route} className="relative">
                            <p
                                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors border-l-2 border-transparent cursor-pointer`}
                                onClick={() => handleItemClick(item)}
                                onMouseEnter={() => {
                                    if (item.children && item.children.length > 0) {
                                        setActiveDropdowns(prev => {
                                            const newSet = new Set(prev);
                                            items.forEach(sibling => {
                                                if (sibling.route !== item.route) {
                                                    newSet.delete(`sub-${sibling.route}`);
                                                    clearSubItems(sibling, newSet);
                                                }
                                            });
                                            newSet.add(`sub-${item.route}`);
                                            return newSet;
                                        });
                                    }
                                }}
                            >
                                <div className="flex items-center space-x-2">
                                    {getIcon(item.icon)}
                                    <span className="font-medium">{item.label}</span>
                                </div>
                                {item.children && item.children.length > 0 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </p>

                            {item.children && item.children.length > 0 && activeDropdowns.has(`sub-${item.route}`) && (
                                <div className="absolute top-0 left-full z-50">
                                    {renderSubMenu(item.children, level + 1, `sub-${item.route}`)}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <nav className="sticky top-0 z-40">
            <div className="mx-auto px-4 sm:px-4 lg:px-4">
                <div className="flex items-center justify-between h-16">

                    <div className="flex items-center justify-center flex-1">
                        <ul className="flex space-x-1">
                            {navigationItems.map((item) => (
                                <li
                                    key={item.route}
                                    className="relative group"
                                    onMouseEnter={() => item.children && handleMouseEnter(item.route, 0)}
                                    onMouseLeave={() => item.children && handleMouseLeave(item.route)}
                                >
                                    <p
                                        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer hover:bg-[#E8E8E8] ${location == item.route?"text-black dark:text-white":""}`}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        {getIcon(item.icon)}
                                        <span className="whitespace-nowrap">{item.label}</span>
                                        {item.children && item.children.length > 0 && (
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdowns.has(item.route) ? 'rotate-180' : ''}`} />
                                        )}
                                    </p>

                                    {item.children && item.children.length > 0 && activeDropdowns.has(item.route) && (
                                        <div className="absolute top-full left-0 z-50">
                                            {renderSubMenu(item.children, 1, item.route)}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DynamicNavOptions;