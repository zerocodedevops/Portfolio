/**
 * Notificaciones internas del sistema para el entorno DEMO (0 peticiones de red).
 */

interface NotificationParams {
  to_name: string;
  to_email: string;
  subject: string;
  message: string;
  action_url?: string;
}

export const sendEmailNotification = async (
  _params: NotificationParams,
): Promise<boolean> => {
  return true;
};

export const notifyNewTicket = async (_ticket: {
  type: "incidencia" | "observacion" | "extra" | "material";
  clientName: string;
  description: string;
  authorName: string;
}) => {
  return true;
};
