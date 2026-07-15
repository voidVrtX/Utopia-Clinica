import { Alert } from 'react-native';

export interface Notification {
  id: string;
  type: 'doctor_registered' | 'patient_registered' | 'document_verified' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: {
    doctorId?: string;
    doctorName?: string;
    patientId?: string;
    patientName?: string;
    email?: string;
    [key: string]: any;
  };
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  subscribe(callback: (notifications: Notification[]) => void) {
    this.listeners.push(callback);
    callback(this.notifications);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.notifications));
  }

  /**
   * Notificar registro de nuevo médico
   */
  notifyDoctorRegistered(doctorName: string, doctorId: string, email: string) {
    const notification: Notification = {
      id: `doctor_${Date.now()}`,
      type: 'doctor_registered',
      title: 'Nuevo Médico Registrado',
      message: `${doctorName} ha sido registrado en el sistema.`,
      timestamp: new Date(),
      read: false,
      data: {
        doctorId,
        doctorName,
        email,
      },
    };

    this.notifications.unshift(notification);
    this.notify();
    this.showAlert(notification.title, notification.message);

    return notification;
  }

  /**
   * Notificar registro de nuevo paciente
   */
  notifyPatientRegistered(patientName: string, patientId: string, email: string) {
    const notification: Notification = {
      id: `patient_${Date.now()}`,
      type: 'patient_registered',
      title: 'Nuevo Paciente Registrado',
      message: `${patientName} se ha registrado como paciente.`,
      timestamp: new Date(),
      read: false,
      data: {
        patientId,
        patientName,
        email,
      },
    };

    this.notifications.unshift(notification);
    this.notify();
    this.showAlert(notification.title, notification.message);

    return notification;
  }

  /**
   * Notificar verificación de documento
   */
  notifyDocumentVerified(doctorName: string, documentType: string) {
    const notification: Notification = {
      id: `doc_${Date.now()}`,
      type: 'document_verified',
      title: 'Documento Verificado',
      message: `El ${documentType} de ${doctorName} ha sido verificado.`,
      timestamp: new Date(),
      read: false,
      data: {
        doctorName,
        documentType,
      },
    };

    this.notifications.unshift(notification);
    this.notify();

    return notification;
  }

  /**
   * Enviar alerta personalizada
   */
  notifyAlert(title: string, message: string) {
    const notification: Notification = {
      id: `alert_${Date.now()}`,
      type: 'alert',
      title,
      message,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(notification);
    this.notify();
    this.showAlert(title, message);

    return notification;
  }

  /**
   * Marcar notificación como leída
   */
  markAsRead(notificationId: string) {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  /**
   * Eliminar notificación
   */
  delete(notificationId: string) {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.notify();
  }

  /**
   * Obtener todas las notificaciones
   */
  getAll(): Notification[] {
    return this.notifications;
  }

  /**
   * Obtener notificaciones no leídas
   */
  getUnread(): Notification[] {
    return this.notifications.filter((n) => !n.read);
  }

  /**
   * Contar no leídas
   */
  getUnreadCount(): number {
    return this.getUnread().length;
  }

  /**
   * Limpiar notificaciones antiguas
   */
  clearOldNotifications(daysOld: number = 30) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - daysOld * 24 * 60 * 60 * 1000);

    this.notifications = this.notifications.filter((n) => n.timestamp > cutoff);
    this.notify();
  }

  /**
   * Mostrar alerta nativa
   */
  private showAlert(title: string, message: string) {
    Alert.alert(title, message, [{ text: 'OK', style: 'default' }]);
  }
}

export const notificationManager = new NotificationManager();
