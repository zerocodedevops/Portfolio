import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from '../demo/demoStore';
import { ChatBubbleLeftRightIcon, HeartIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { auth } from '../demo/demoAuth';
import { db } from '../demo/demoStore';
import type { VecinoOutletContext } from '../types/domain';
import { Link, useOutletContext } from 'react-router-dom';
import { canModerateCommunity, canConveneOrPublish, hasAdministratorAccess } from '../utils/residentRoles';
import { uploadCommunityImages, removeCommunityImages, getCommunityImageUrl } from '../services/comunidadStorage';
import { notifyCommunityMembers, notifyPostAuthor, notifyMentionedResidents } from '../services/notificacionesService';
import { buildMentionFilter, getActiveMentionToken, parseMentions, resolveUidsFromNames, splitMentions } from '../utils/mentions';

type PostCategory = 'Aviso'|'Propuesta'|'Recordatorio'|'General';
interface Post { id: string; idComunidad: string; autorUid: string; autorNombre: string; texto: string; etiqueta: string; imagenes: string[]; titulo?: string; informacion?: string; icono?: string; creadaEn?: { toDate?: () => Date }; }
interface Comment { id: string; autorUid: string; autorNombre: string; texto: string; creadaEn?: { toDate?: () => Date }; }

interface ComunidadProps {
  readonly embedded?: boolean;
}

const MENTION_REGEX = /(?:^|(?<=\s))@(\p{L}[\p{L}\s]*)$/u;

function boardRoleLabel(cargo: unknown) {
  if (typeof cargo !== 'string' && typeof cargo !== 'number') return '';
  const normalized = String(cargo).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  if (/\bvicepresident[ae]\b/.test(normalized)) return 'Vicepresidente';
  if (/\bpresident[ae]\b/.test(normalized)) return 'Presidente';
  if (/\bvocal\b/.test(normalized)) return 'Vocal';
  return '';
}

function commentDateLabel(creadaEn?: Comment['creadaEn']) {
  const date = creadaEn?.toDate?.();
  if (!date || Number.isNaN(date.getTime())) return '';
  const parts = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((entry) => entry.type === type)?.value || '';
  return `${part('day')}/${part('month')}/${part('year')} ${part('hour')}:${part('minute')}`;
}

function MentionSegments({ text, residents }: { readonly text: string; readonly residents: string[] }) {
  const segments = useMemo(() => splitMentions(text, residents), [text, residents]);
  return (
    <>
      {segments.map((seg, sIdx) => {
        const segKey = `mention-${seg.mention ? 'm' : 't'}-${seg.text}-${sIdx}`;
        return seg.mention ? (
          <strong key={segKey} className="font-bold text-emerald-700 dark:text-emerald-400">
            {seg.text}
          </strong>
        ) : (
          <span key={segKey}>{seg.text}</span>
        );
      })}
    </>
  );
}

function PostCard({
  post,
  uid,
  isAdmin,
  residentNames,
  imageUrlList,
  reactionCount,
  isLiked,
  commentCount,
  isExpanded,
  onToggleReaction,
  onToggleExpand,
  onDeletePost,
  children,
}: {
  readonly post: Post;
  readonly uid: string;
  readonly isAdmin: boolean;
  readonly residentNames: string[];
  readonly imageUrlList: string[];
  readonly reactionCount: number;
  readonly isLiked: boolean;
  readonly commentCount?: number;
  readonly isExpanded: boolean;
  readonly onToggleReaction: () => void;
  readonly onToggleExpand: () => void;
  readonly onDeletePost: () => void;
  readonly children?: React.ReactNode;
}) {
  const dateText = post.creadaEn?.toDate?.()
    ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(post.creadaEn.toDate())
    : 'Ahora';

  const avatarInitials = post.autorNombre
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const canDelete = post.autorUid === uid || isAdmin;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
                  {avatarInitials}
                </span>
                <div>
                  <p className="text-sm font-bold">{post.autorNombre}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{dateText}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {post.etiqueta}
                </span>
                {canDelete && (
                  <button
                    type="button"
                    aria-label="Eliminar publicación"
                    title="Eliminar publicación"
                    onClick={onDeletePost}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            {post.titulo && <h2 className="mt-4 font-semibold leading-snug">{post.titulo}</h2>}
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
              <MentionSegments text={post.texto} residents={residentNames} />
            </p>
            {post.informacion && (
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                {post.informacion}
              </p>
            )}
          </div>
          {post.icono && (
            <span
              aria-hidden="true"
              className="material-symbols-outlined grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-xl text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
            >
              {post.icono}
            </span>
          )}
        </div>
      </div>
      {imageUrlList.length > 0 && (
        <div
          className="grid gap-1 px-1 pb-1"
          style={{ gridTemplateColumns: imageUrlList.length > 1 ? 'repeat(2,minmax(0,1fr))' : '1fr' }}
        >
          {imageUrlList.map((url, index) => (
            <img
              key={url}
              src={url}
              alt={`Imagen ${index + 1} de la publicación`}
              className="max-h-[28rem] w-full rounded-lg object-cover"
              loading="lazy"
            />
          ))}
        </div>
      )}
      <footer className="flex items-center gap-2 border-t border-slate-100 px-3 py-2 dark:border-zinc-800">
        <button
          type="button"
          aria-pressed={isLiked}
          onClick={onToggleReaction}
          className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold ${
            isLiked
              ? 'text-rose-700 dark:text-rose-300'
              : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
        >
          <HeartIcon className="h-4 w-4" />
          Me gusta <span>{reactionCount}</span>
        </button>
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <ChatBubbleLeftRightIcon className="h-4 w-4" />
          Comentarios <span className="tabular-nums">({commentCount ?? '…'})</span>
        </button>
      </footer>
      {children}
    </article>
  );
}

function Comunidad({ embedded = false }: ComunidadProps) {
  const [resident] = useOutletContext<VecinoOutletContext>();
  const [allResidents, setAllResidents] = useState<Array<{ uid: string; nombre: string }>>([]);
  const [mentionSuggestions, setMentionSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const uid = auth.currentUser?.uid || resident?.uid || '';
  const communityId = resident?.idComunidad || '';
  const isAdmin = hasAdministratorAccess(resident);
  const canPublish = canConveneOrPublish(resident, auth.currentUser?.email);
  const canModerate = canModerateCommunity(resident, auth.currentUser?.email);
  const [posts, setPosts] = useState<Post[]>([]);
  const [boardRolesByUid, setBoardRolesByUid] = useState<Record<string, string>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string[]>>({});
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [myReactions, setMyReactions] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const [commentMentionSuggestions, setCommentMentionSuggestions] = useState<string[]>([]);
  const [activeCommentSuggestionIndex, setActiveCommentSuggestionIndex] = useState(0);
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [category, setCategory] = useState<PostCategory>('General');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const embeddedFeedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!communityId) { setLoading(false); return undefined; }
    return onSnapshot(query(collection(db, 'publicaciones'), where('idComunidad', '==', communityId)), (snapshot) => {
      const list = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Post).sort((a, b) => (b.creadaEn?.toDate?.().getTime() || 0) - (a.creadaEn?.toDate?.().getTime() || 0)).slice(0, 40);
      setPosts(list); setLoading(false);
    }, (listenError) => { console.error(listenError); setError('No se pudo cargar el tablón de la comunidad.'); setLoading(false); });
  }, [communityId]);

  useEffect(() => {
    if (!communityId) { setBoardRolesByUid({}); return undefined; }
    const residentsQuery = query(collection(db, 'vecinosPublicos'), where('idComunidad', '==', communityId), where('activo', '==', true));
    return onSnapshot(residentsQuery, (snapshot) => {
      const roles: Record<string, string> = {};
      snapshot.docs.forEach((entry) => {
        const data = entry.data();
        const role = boardRoleLabel(data.cargo);
        if (typeof data.uid === 'string' && role) roles[data.uid] = role;
      });
      setBoardRolesByUid(roles);
      const seenUids = new Set<string>();
      const neighbors = snapshot.docs
        .map((entry) => {
          const data = entry.data();
          const nombre = [data.nombre, data.apellidos].filter(Boolean).join(' ') || (data.displayName as string) || '';
          const residentUid = (typeof data.uid === 'string' && data.uid) ? data.uid : entry.id;
          return { uid: residentUid, nombre: nombre.trim() };
        })
        .filter((item) => {
          if (!item.nombre || seenUids.has(item.uid)) return false;
          seenUids.add(item.uid);
          return true;
        });
      setAllResidents(neighbors);
    }, (listenError) => console.error('No se pudieron cargar los cargos de la Junta de Gobierno:', listenError));
  }, [communityId]);

  useEffect(() => {
    if (!embedded || loading || error || posts.length === 0) return;
    const feed = embeddedFeedRef.current;
    const mount = feed?.closest<HTMLElement>('.dashboard-community-feed');
    const noticeList = mount?.parentElement;
    if (!mount || !noticeList) return;
    for (const child of noticeList.children) {
      if (child !== mount) child.remove();
    }
  }, [embedded, error, loading, posts.length]);

  useEffect(() => {
    let active = true;
    void Promise.all(posts.map(async (post) => {
      const urls = await Promise.all((post.imagenes || []).map(async (path) => {
        if (/^https?:\/\//i.test(path)) return path;
        return getCommunityImageUrl(path);
      }).map((task) => task.catch((storageError) => { console.error('No se pudo mostrar una imagen del tablón:', storageError); return ''; })));
      return [post.id, urls.filter(Boolean)] as const;
    })).then((entries) => { if (active) setImageUrls(Object.fromEntries(entries)); });
    return () => { active = false; };
  }, [posts]);

  useEffect(() => {
    if (!uid || !posts.length) { setReactionCounts({}); setMyReactions(new Set()); return undefined; }
    const stops = posts.map((post) => onSnapshot(collection(db, 'publicaciones', post.id, 'reacciones'), (snapshot) => {
      setReactionCounts((current) => ({ ...current, [post.id]: snapshot.size }));
      const userReacted = snapshot.docs.some((entry) => entry.id === uid);
      setMyReactions((current) => {
        const next = new Set(current);
        if (userReacted) {
          next.add(post.id);
        } else {
          next.delete(post.id);
        }
        return next;
      });
    }, (listenError) => console.error('No se pudieron cargar reacciones:', listenError)));
    return () => stops.forEach((stop) => stop());
  }, [uid, posts]);

  useEffect(() => {
    if (!posts.length) { setCommentCounts({}); return undefined; }
    const stops = posts.map((post) => onSnapshot(collection(db, 'publicaciones', post.id, 'comentarios'), (snapshot) => {
      setCommentCounts((current) => ({ ...current, [post.id]: snapshot.size }));
    }, (listenError) => console.error(`No se pudo cargar el total de comentarios de ${post.id}:`, listenError)));
    return () => stops.forEach((stop) => stop());
  }, [posts]);

  useEffect(() => {
    if (!expandedId) { setComments([]); return undefined; }
    return onSnapshot(query(collection(db, 'publicaciones', expandedId, 'comentarios'), orderBy('creadaEn', 'asc')), (snapshot) => setComments(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data({ serverTimestamps: 'estimate' }) }) as Comment)), (listenError) => { console.error(listenError); setError('No se pudieron cargar los comentarios.'); });
  }, [expandedId]);

  const residentName = useMemo(() => [resident?.datosPersonales?.nombre, resident?.datosPersonales?.apellidos].filter(Boolean).join(' ') || auth.currentUser?.displayName || 'Vecino', [resident]);
  const residentNames = useMemo(() => allResidents.map((r) => r.nombre), [allResidents]);

  function insertCommentMention(chosenName: string) {
    const el = commentInputRef.current;
    if (!el) return;
    const cursor = el.selectionStart || commentDraft.length;
    const before = commentDraft.slice(0, cursor);
    const after = commentDraft.slice(cursor);
    const match = MENTION_REGEX.exec(before);
    if (!match) return;
    const atPos = before.lastIndexOf('@');
    const newBefore = before.slice(0, atPos) + '@' + chosenName + ' ';
    const newText = newBefore + after;
    setCommentDraft(newText);
    setCommentMentionSuggestions([]);
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = newBefore.length;
    }, 0);
  }

  function insertMention(chosenName: string) {
    const el = textareaRef.current;
    if (!el) return;
    const cursor = el.selectionStart || draft.length;
    const before = draft.slice(0, cursor);
    const after = draft.slice(cursor);
    const match = MENTION_REGEX.exec(before);
    if (!match) return;
    const atPos = before.lastIndexOf('@');
    const newBefore = before.slice(0, atPos) + '@' + chosenName + ' ';
    const newText = newBefore + after;
    setDraft(newText);
    setMentionSuggestions([]);
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = newBefore.length;
    }, 0);
  }

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canPublish) { setError('Solo Administración, Presidencia y Vicepresidencia pueden publicar avisos.'); return; }
    if (!uid || !communityId || !draft.trim() || saving) return;
    const imagePicker = event.currentTarget.querySelector<HTMLInputElement>('#community-images');
    setSaving(true); setError('');
    const postRef = doc(collection(db, 'publicaciones'));
    let paths: string[] = [];
    try {
      if (files.length) paths = await uploadCommunityImages(files, uid, postRef.id);
      await setDoc(postRef, {
        idComunidad: communityId, autorUid: uid, autorNombre: residentName,
        texto: draft.trim(), etiqueta: category, imagenes: paths,
        creadaEn: serverTimestamp(), actualizadaEn: serverTimestamp(),
      });
      // Use a stable id so the notification can refer to the published post.
      await notifyCommunityMembers({ communityId, actorUid: uid, actorName: residentName, type: 'comunidad', title: `Nueva publicación · ${category}`, description: draft.trim().slice(0, 180), route: '/dashboard/comunidad', sourceId: postRef.id, excludeActor: true }).catch((notificationError) => { console.error('No se pudo notificar la publicación:', notificationError); setError('La publicación se guardó, pero no se pudieron enviar las notificaciones.'); });
      const uidToNameMap = Object.fromEntries(allResidents.map((r) => [r.uid, r.nombre]));
      const mentionedNames = parseMentions(draft, residentNames);
      const mentionedUids = resolveUidsFromNames(mentionedNames, uidToNameMap);
      if (mentionedUids.length > 0) {
        await notifyMentionedResidents({
          communityId,
          actorUid: uid,
          actorName: residentName,
          postId: postRef.id,
          mentionedUids,
          postPreview: draft.trim(),
        }).catch((err) => console.error('No se pudo notificar a los mencionados:', err));
      }
      setDraft(''); setFiles([]); setCategory('General');
      if (imagePicker) imagePicker.value = '';
    } catch (saveError) {
      console.error(saveError); setError('No se pudo publicar. Comprueba tu conexión y los permisos de imágenes.');
      if (paths.length) await removeCommunityImages(paths).catch((cleanupError) => console.error(cleanupError));
    } finally { setSaving(false); }
  }

  async function toggleReaction(post: Post) {
    if (!uid) return;
    const reactionRef = doc(db, 'publicaciones', post.id, 'reacciones', uid);
    try {
      if (myReactions.has(post.id)) await deleteDoc(reactionRef);
      else {
        await setDoc(reactionRef, { uid, creadaEn: serverTimestamp() });
        await notifyPostAuthor({ communityId, actorUid: uid, actorName: residentName, postId: post.id, postAuthorUid: post.autorUid, activityId: uid, activityType: 'reaccion', description: 'A un vecino le ha gustado tu publicación.' }).catch((notificationError) => console.error('No se pudo notificar la reacción:', notificationError));
      }
    }
    catch (actionError) { console.error(actionError); setError('No se pudo guardar tu reacción.'); }
  }

  async function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const post = posts.find((entry) => entry.id === expandedId);
    if (!post || !uid || !commentDraft.trim()) return;
    try {
      const createdComment = await addDoc(collection(db, 'publicaciones', post.id, 'comentarios'), { autorUid: uid, autorNombre: residentName, texto: commentDraft.trim(), creadaEn: serverTimestamp() });
      await notifyPostAuthor({ communityId, actorUid: uid, actorName: residentName, postId: post.id, postAuthorUid: post.autorUid, activityId: createdComment.id, activityType: 'comentario', description: commentDraft.trim().slice(0, 180) }).catch((notificationError) => console.error('No se pudo notificar el comentario:', notificationError));
      const uidToNameMap = Object.fromEntries(allResidents.map((r) => [r.uid, r.nombre]));
      const mentionedNames = parseMentions(commentDraft, residentNames);
      const mentionedUids = resolveUidsFromNames(mentionedNames, uidToNameMap);
      if (mentionedUids.length > 0) {
        await notifyMentionedResidents({
          communityId,
          actorUid: uid,
          actorName: residentName,
          postId: post.id,
          mentionedUids,
          postPreview: commentDraft.trim(),
        }).catch((err) => console.error('No se pudo notificar a los mencionados en comentario:', err));
      }
      setCommentDraft('');
    } catch (actionError) { console.error(actionError); setError('No se pudo añadir el comentario.'); }
  }

  async function deleteComment(postId: string, comment: Comment) {
    if (!uid || (comment.autorUid !== uid && !canModerate)) return;
    try { await deleteDoc(doc(db, 'publicaciones', postId, 'comentarios', comment.id)); }
    catch (actionError) { console.error(actionError); setError('No se pudo eliminar el comentario.'); }
  }

  async function deletePost(post: Post) {
    if (!uid || (post.autorUid !== uid && !isAdmin)) return;
    if (!window.confirm('¿Quieres eliminar esta publicación y sus imágenes?')) return;
    try {
      await deleteDoc(doc(db, 'publicaciones', post.id));
      if (post.imagenes?.length) await removeCommunityImages(post.imagenes).catch((storageError) => console.error('No se pudieron borrar todas las imágenes:', storageError));
    } catch (actionError) { console.error(actionError); setError('No se pudo eliminar la publicación.'); }
  }

  const visiblePosts = embedded ? posts.slice(0, 3) : posts;
  if (embedded && !loading && (error || posts.length === 0)) return null;

  return (
    <div ref={embedded ? embeddedFeedRef : undefined} className={`mx-auto space-y-4 text-slate-900 dark:text-white ${embedded ? 'max-w-none' : 'max-w-4xl space-y-6'}`}>
      {!embedded && (
        <header>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700 dark:text-emerald-300">Jardín del Poeta</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Tablón de Avisos</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">Avisos, propuestas y conversaciones vecinales.</p>
        </header>
      )}

      {!embedded && error && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </p>
      )}

      {!embedded && canPublish && (
        <form onSubmit={createPost} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <label className="sr-only" htmlFor="community-post">Escribe una publicación</label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              id="community-post"
              maxLength={3000}
              rows={3}
              value={draft}
              onChange={(event) => {
                const val = event.target.value;
                setDraft(val);
                const token = getActiveMentionToken(val, event.target.selectionStart || 0);
                if (token !== null) {
                  const filtered = buildMentionFilter(token, residentNames);
                  setMentionSuggestions(filtered);
                  setActiveSuggestionIndex(0);
                } else {
                  setMentionSuggestions([]);
                }
              }}
              onKeyDown={(event) => {
                if (!mentionSuggestions.length) return;
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setActiveSuggestionIndex((prev) => (prev + 1) % mentionSuggestions.length);
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setActiveSuggestionIndex((prev) => (prev - 1 + mentionSuggestions.length) % mentionSuggestions.length);
                } else if (event.key === 'Enter' || event.key === 'Tab') {
                  event.preventDefault();
                  const targetNeighbor = mentionSuggestions[activeSuggestionIndex];
                  if (targetNeighbor) insertMention(targetNeighbor);
                } else if (event.key === 'Escape') {
                  setMentionSuggestions([]);
                }
              }}
              placeholder={`¿Qué quieres compartir, ${residentName.split(' ')[0]}?`}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-950"
            />
            {mentionSuggestions.length > 0 && (
              <div role="listbox" aria-label="Vecinos sugeridos" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-48 overflow-y-auto rounded-xl border border-emerald-300 bg-white p-1.5 shadow-lg dark:border-emerald-700 dark:bg-zinc-900">
                <p className="px-2 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">Mencionar a un vecino:</p>
                {mentionSuggestions.map((name, idx) => (
                  <button
                    key={`post-mention-${name}-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={idx === activeSuggestionIndex}
                    onClick={() => insertMention(name)}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                      idx === activeSuggestionIndex
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    @{name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor="post-category">Tipo de publicación</label>
              <select
                id="post-category"
                value={category}
                onChange={(event) => setCategory(event.target.value as PostCategory)}
                className="min-h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-900"
              >
                {['General','Aviso','Propuesta','Recordatorio'].map((item) => <option key={item}>{item}</option>)}
              </select>
              <label htmlFor="community-images" className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <PhotoIcon className="h-4 w-4" />Fotos
              </label>
              <input
                id="community-images"
                type="file"
                accept="image/jpeg,image/png,image/heic"
                multiple
                className="sr-only"
                onChange={(event) => {
                  const selected = Array.from(event.target.files || []).slice(0, 3);
                  setFiles(selected);
                  if ((event.target.files?.length || 0) > 3) setError('Puedes adjuntar un máximo de 3 imágenes.');
                }}
              />
              {files.length > 0 && (
                <span className="text-xs text-slate-500">
                  {files.length} {files.length === 1 ? 'foto' : 'fotos'} seleccionadas
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!draft.trim() || saving}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlusIcon className="h-4 w-4" />{saving ? 'Publicando…' : 'Publicar'}
            </button>
          </div>
        </form>
      )}

      {!embedded && !canPublish && (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Los avisos nuevos los publica Administración, Presidencia o Vicepresidencia. Puedes comentar los avisos existentes.
        </p>
      )}

      {loading && (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500 dark:bg-zinc-900">
          Cargando publicaciones…
        </p>
      )}

      {!loading && error && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          No se pudieron cargar los avisos. Prueba a recargar la página.
        </p>
      )}

      {!loading && !error && visiblePosts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <ChatBubbleLeftRightIcon className="mx-auto h-8 w-8 text-slate-300" />
          <h2 className="mt-3 font-bold">El tablón está vacío</h2>
          <p className="mt-1 text-sm text-slate-500">Publica el primer aviso o propuesta de la comunidad.</p>
        </div>
      )}

      {!loading && !error && visiblePosts.length > 0 && (
        <div className={embedded ? "grid grid-cols-2 gap-3" : "space-y-4"}>
          {visiblePosts.map((post) => {
            if (embedded) {
              const postHeader = post.titulo || post.texto.trim().split(/\r?\n/)[0];
              return (
                <Link
                  key={post.id}
                  to="/dashboard/comunidad"
                  title={postHeader}
                  className="block min-h-20 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
                >
                  <span className="line-clamp-2 font-semibold">{postHeader}</span>
                </Link>
              );
            }

            return (
              <PostCard
                key={post.id}
                post={post}
                uid={uid}
                isAdmin={isAdmin}
                residentNames={residentNames}
                imageUrlList={imageUrls[post.id] || []}
                reactionCount={reactionCounts[post.id] || 0}
                isLiked={myReactions.has(post.id)}
                commentCount={commentCounts[post.id]}
                isExpanded={expandedId === post.id}
                onToggleReaction={() => void toggleReaction(post)}
                onToggleExpand={() => setExpandedId((current) => current === post.id ? '' : post.id)}
                onDeletePost={() => void deletePost(post)}
              >
                {expandedId === post.id && (
                  <section className="border-t border-slate-100 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <ul className="space-y-3">
                      {comments.map((comment) => {
                        const boardRole = boardRolesByUid[comment.autorUid] || (comment.autorUid === uid ? boardRoleLabel(resident?.cargo) : '');
                        const dateText = commentDateLabel(comment.creadaEn);
                        const commentDate = comment.creadaEn?.toDate?.();
                        const canDeleteComment = comment.autorUid === uid || canModerate;
                        return (
                          <li key={comment.id} className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm">
                                <span className="font-semibold">{comment.autorNombre}</span>
                                {boardRole && (
                                  <span className="ml-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                    ({boardRole})
                                  </span>
                                )}
                                <span> <MentionSegments text={comment.texto} residents={residentNames} /></span>
                              </p>
                              <time className="mt-1 block text-xs text-slate-500 dark:text-zinc-400" dateTime={commentDate?.toISOString()}>
                                {dateText || 'Fecha no disponible'}
                              </time>
                            </div>
                            {canDeleteComment && (
                              <button
                                type="button"
                                onClick={() => void deleteComment(post.id, comment)}
                                aria-label="Eliminar comentario"
                                title="Eliminar comentario"
                                className="rounded p-1 text-slate-400 hover:text-rose-700"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </li>
                        );
                      })}
                      {comments.length === 0 && (
                        <li className="text-xs text-slate-500">Sé la primera persona en comentar.</li>
                      )}
                    </ul>

                    <form onSubmit={addComment} className="relative mt-4 flex gap-2">
                      <label className="sr-only" htmlFor={`comment-${post.id}`}>Añadir comentario</label>
                      <div className="relative min-w-0 flex-1">
                        <input
                          ref={commentInputRef}
                          id={`comment-${post.id}`}
                          maxLength={1000}
                          value={commentDraft}
                          onChange={(event) => {
                            const val = event.target.value;
                            setCommentDraft(val);
                            const token = getActiveMentionToken(val, event.target.selectionStart || 0);
                            if (token !== null) {
                              const filtered = buildMentionFilter(token, residentNames);
                              setCommentMentionSuggestions(filtered);
                              setActiveCommentSuggestionIndex(0);
                            } else {
                              setCommentMentionSuggestions([]);
                            }
                          }}
                          onKeyDown={(event) => {
                            if (!commentMentionSuggestions.length) return;
                            if (event.key === 'ArrowDown') {
                              event.preventDefault();
                              setActiveCommentSuggestionIndex((prev) => (prev + 1) % commentMentionSuggestions.length);
                            } else if (event.key === 'ArrowUp') {
                              event.preventDefault();
                              setActiveCommentSuggestionIndex((prev) => (prev - 1 + commentMentionSuggestions.length) % commentMentionSuggestions.length);
                            } else if (event.key === 'Enter' || event.key === 'Tab') {
                              event.preventDefault();
                              const targetNeighbor = commentMentionSuggestions[activeCommentSuggestionIndex];
                              if (targetNeighbor) insertCommentMention(targetNeighbor);
                            } else if (event.key === 'Escape') {
                              setCommentMentionSuggestions([]);
                            }
                          }}
                          placeholder="Escribe un comentario… (usa @ para mencionar)"
                          className="w-full min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-zinc-700 dark:bg-zinc-900"
                        />
                        {commentMentionSuggestions.length > 0 && (
                          <div role="listbox" aria-label="Vecinos sugeridos" className="absolute bottom-full left-0 right-0 z-30 mb-1 max-h-48 overflow-y-auto rounded-xl border border-emerald-300 bg-white p-1.5 shadow-lg dark:border-emerald-700 dark:bg-zinc-900">
                            <p className="px-2 py-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">Mencionar a un vecino:</p>
                            {commentMentionSuggestions.map((name, idx) => (
                              <button
                                key={`comment-mention-${name}-${idx}`}
                                type="button"
                                role="option"
                                aria-selected={idx === activeCommentSuggestionIndex}
                                onClick={() => insertCommentMention(name)}
                                className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                                  idx === activeCommentSuggestionIndex
                                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                                    : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-200 dark:hover:bg-zinc-800'
                                }`}
                              >
                                @{name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={!commentDraft.trim()}
                        className="rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-black"
                      >
                        Enviar
                      </button>
                    </form>
                  </section>
                )}
              </PostCard>
            );
          })}
        </div>
      )}

      {embedded && posts.length > visiblePosts.length && (
        <Link to="/dashboard/comunidad" className="inline-flex text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-300">
          Ver todas las publicaciones
        </Link>
      )}
    </div>
  );
}

export default Comunidad;
