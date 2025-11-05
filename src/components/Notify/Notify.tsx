import React, { useEffect, useState } from "react";
import * as Icon from "@phosphor-icons/react";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotifyProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    type?: NotificationType;
    duration?: number;
}

export const Notify: React.FC<NotifyProps> = ({
    open,
    onOpenChange,
    title,
    description,
    type = "info",
    duration = 10000,
}) => {
    const [isVisible, setIsVisible] = useState(open);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setIsVisible(open);
        setProgress(100);
    }, [open]);

    useEffect(() => {
        if (isVisible && duration > 0) {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
                setProgress(remaining);
                if (elapsed >= duration) clearInterval(interval);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isVisible, duration]);

    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => handleClose(), duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onOpenChange(false), 300);
    };

    const getIcon = () => {
        switch (type) {
            case "success":
                return <Icon.CheckCircle size={40} weight="duotone" className="text-white" />;
            case "error":
                return <Icon.XCircle size={40} weight="duotone" className="text-white" />;
            case "warning":
                return <Icon.WarningCircle size={40} weight="duotone" className="text-white" />;
            default:
                return <Icon.Info size={40} weight="duotone" className="text-white" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case "success":
                return { progress: "bg-green-500", bg: "bg-green-50", text: "text-green-800" };
            case "error":
                return { progress: "bg-red-500", bg: "bg-red-50", text: "text-red-800" };
            case "warning":
                return { progress: "bg-yellow-500", bg: "bg-yellow-50", text: "text-yellow-800" };
            default:
                return { progress: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-800" };
        }
    };

    const styles = getStyles();

    if (!open && !isVisible) return null;

    return (
        <div
            className={`fixed bottom-5 right-2 z-[9999999] max-w-[450px] max-sm:max-w-[360px] w-full transition-all duration-300 ease-in-out
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"}
      `}
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className={`relative flex border rounded-lg shadow-lg overflow-hidden ${styles.bg}`}>
                <div className={`flex items-center justify-center w-14 bg-gray-300 ${styles.progress}`}>
                    {getIcon()}
                </div>

                <div className="flex-1 p-4 max-sm:p-2">
                    <div className="flex justify-between items-start">
                        <div className={`font-semibold text-sm  ${styles.text}`}>{title}</div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600  rounded transition-colors duration-200 absolute top-2 right-2"
                            aria-label="Fechar notificação"
                        >
                            <Icon.XCircle size={26} aria-hidden="true" />
                        </button>
                    </div>
                    <div className="text-gray-700 text-sm mt-1 max-sm:text-[13px]">{description}</div>
                </div>

                {duration > 0 && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 bg-opacity-50">
                        <div
                            className={`${styles.progress} h-full transition-all duration-50 ease-linear`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
