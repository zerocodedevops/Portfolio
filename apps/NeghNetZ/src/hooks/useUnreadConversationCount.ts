import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from '../demo/demoStore';
import { db } from '../demo/demoStore';
import type { VecinoData } from '../types/domain';

interface ConversationSummary {
  participantes?: string[];
  ultimoMensajeId?: string;
  ultimoMensajePor?: string;
  actualizadoEn?: { toDate?: () => Date };
  leidoEn?: Record<string, { toDate?: () => Date }>;
  ocultadaPara?: Record<string, boolean>;
  borradaDesde?: Record<string, { toDate?: () => Date }>;
}

function millis(value?: { toDate?: () => Date }) {
  const date = value?.toDate?.();
  return date && Number.isFinite(date.getTime()) ? date.getTime() : 0;
}

export function useUnreadConversationCount(resident: VecinoData | null | undefined) {
  const uid = resident?.uid;
  const communityId = resident?.idComunidad;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!uid || !communityId) {
      setCount(0);
      return undefined;
    }

    return onSnapshot(query(
      collection(db, 'conversaciones'),
      where('participantes', 'array-contains', uid),
      where('idComunidad', '==', communityId),
    ), (snapshot) => {
      const unread = snapshot.docs.filter((entry) => {
        const conversation = entry.data() as ConversationSummary;
        const updatedAt = millis(conversation.actualizadoEn);
        const readAt = millis(conversation.leidoEn?.[uid]);
        const deletedAt = millis(conversation.borradaDesde?.[uid]);
        return Boolean(conversation.ultimoMensajeId)
          && conversation.ultimoMensajePor !== uid
          && conversation.ocultadaPara?.[uid] !== true
          && updatedAt > readAt
          && updatedAt > deletedAt;
      }).length;
      setCount(unread);
    }, (error) => {
      console.error('No se pudo cargar el contador de conversaciones sin leer:', error);
      setCount(0);
    });
  }, [uid, communityId]);

  return count;
}
