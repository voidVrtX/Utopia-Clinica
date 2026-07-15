import { useState, useCallback } from 'react';
import { notificationManager, Notification } from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [panelVisible, setPanelVisible] = useState(false);

  // Suscribirse a cambios de notificaciones
  useCallback(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return () => unsubscribe();
  }, []);

  return {
    notifications,
    unreadCount: notificationManager.getUnreadCount(),
    panelVisible,
    setPanelVisible,
    notifyDoctorRegistered: notificationManager.notifyDoctorRegistered.bind(notificationManager),
    notifyPatientRegistered: notificationManager.notifyPatientRegistered.bind(notificationManager),
    notifyDocumentVerified: notificationManager.notifyDocumentVerified.bind(notificationManager),
    notifyAlert: notificationManager.notifyAlert.bind(notificationManager),
    markAsRead: notificationManager.markAsRead.bind(notificationManager),
    deleteNotification: notificationManager.delete.bind(notificationManager),
  };
};
