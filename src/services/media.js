const DB_NAME = 'vyron-media';
const STORE_NAME = 'files';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMedia(file) {
  if (!file) return '';
  if (file.size > 40 * 1024 * 1024) throw new Error('Video must be smaller than 40 MB');
  const db = await openDb();
  const id = `media-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(file, id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return id;
}

export async function getMediaUrl(id) {
  if (!id) return '';
  if (id.startsWith('blob:') || id.startsWith('data:') || /^https?:/.test(id)) return id;
  const db = await openDb();
  const blob = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return blob ? URL.createObjectURL(blob) : '';
}

export function MediaVideo({ src, className = '', poster = '', controls = true, autoPlay = false, muted = false }) {
  const [url, setUrl] = useState(src?.startsWith('blob:') || src?.startsWith('data:') || /^https?:/.test(src || '') ? src : '');
  useEffect(() => {
    let active = true;
    let created = '';
    if (!src) return () => {};
    if (/^https?:|^blob:|^data:/.test(src)) {
      setUrl(src);
      return () => {};
    }
    getMediaUrl(src).then((next) => {
      if (!active) return;
      created = next?.startsWith('blob:') ? next : '';
      setUrl(next);
    });
    return () => { active = false; if (created) URL.revokeObjectURL(created); };
  }, [src]);
  if (!url) return null;
  return createElement('video', { src: url, poster, controls, autoPlay, muted, playsInline: true, className });
}
import { createElement, useEffect, useState } from 'react';

