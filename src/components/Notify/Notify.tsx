import React, { useEffect, useState } from "react";
import * as Icon from "@phosphor-icons/react";

export type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
    id: string;
    title: string;
    description: string;
    type: NotificationType;
    duration: number;
    isClosing: boolean;
}

interface NotifyProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    type?: NotificationType;
    duration?: number;
}

// Hook para gerenciar notificações
const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Omit<Notification, "id" | "isClosing">) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id, isClosing: false };
        setNotifications((prev) => [...prev, newNotification]);
        return id;
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) => (notif.id === id ? { ...notif, isClosing: true } : notif))
        );
        setTimeout(() => {
            setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        }, 300); // duração da animação de saída
    };

    const clearAll = () => {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, isClosing: true })));
        setTimeout(() => setNotifications([]), 300);
    };

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
    };
};

// Componente individual
const NotificationItem: React.FC<{
    notification: Notification;
    onClose: (id: string) => void;
}> = ({ notification, onClose }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (notification.duration <= 0 || notification.isClosing) return;

        const duration = notification.duration;
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (elapsed >= duration) {
                clearInterval(interval);
                onClose(notification.id);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);


    const getStyles = () => {
        switch (notification.type) {
            case "success":
                return {
                    bg: "bg-green-50 border-green-200",
                    iconBg: "bg-green-500",
                    text: "text-green-800",
                    progress: "bg-green-500",
                };
            case "error":
                return {
                    bg: "bg-red-50 border-red-200",
                    iconBg: "bg-red-500",
                    text: "text-red-800",
                    progress: "bg-red-500",
                };
            case "warning":
                return {
                    bg: "bg-yellow-50 border-yellow-200",
                    iconBg: "bg-yellow-500",
                    text: "text-yellow-800",
                    progress: "bg-yellow-500",
                };
            default:
                return {
                    bg: "bg-blue-50 border-blue-200",
                    iconBg: "bg-blue-500",
                    text: "text-blue-800",
                    progress: "bg-blue-500",
                };
        }
    };

    const styles = getStyles();

    const getIcon = () => {
        switch (notification.type) {
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

    return (
        <div
            className={`relative  flex border rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out
        ${notification.isClosing ? "opacity-0 translate-x-10 scale-95" : "opacity-100 translate-x-0 scale-100"}
        ${styles.bg}`}
        >
            {/* Ícone */}
            <div className={`flex items-center justify-center w-16 ${styles.iconBg}`}>
                {getIcon()}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 p-3">
                <div className="flex justify-between items-start">
                    <div className={`font-semibold text-sm ${styles.text}`}>
                        {notification.title}
                    </div>
                    <button
                        onClick={() => onClose(notification.id)}
                        className="text-gray-400 hover:text-gray-600 rounded transition-colors duration-200 ml-2"
                    >
                        <Icon.X size={16} />
                    </button>
                </div>
                <div className="text-gray-700 text-sm mt-1">{notification.description}</div>
            </div>

            {/* Barra de progresso */}
            {notification.duration > 0 && !notification.isClosing && (
                <div className="absolute bottom-0 left-0 h-1 bg-gray-200 bg-opacity-50 w-full">
                    <div
                        className={`${styles.progress} h-full transition-all duration-50 ease-linear`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
};


// Componente principal
export const Notify: React.FC<NotifyProps> = ({
    open,
    onOpenChange,
    title,
    description,
    type = "info",
    duration = 5000,
}) => {
    const { notifications, addNotification, removeNotification } = useNotifications();

    useEffect(() => {
        if (open && title && description) {
            addNotification({ title, description, type, duration });
            setTimeout(() => onOpenChange(false), 100);
        }
    }, [open, title, description, type, duration]);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-2 right-2 z-[9999] flex flex-col gap-3 max-w-[450px] max-sm:max-w-[360px]">
            {[...notifications].reverse().map((notif) => (
                <NotificationItem key={notif.id} notification={notif} onClose={removeNotification} />
            ))}
        </div>
    );
};

export default Notify;
