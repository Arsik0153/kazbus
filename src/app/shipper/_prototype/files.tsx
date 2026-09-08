'use client';
import { useState } from 'react';
import { Attachment } from './model';
function database(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const r = indexedDB.open('jol-shipper-files', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('files');
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(Error('Хранилище файлов недоступно.'));
    });
}
export async function saveFiles(files: File[]): Promise<Attachment[]> {
    if (
        files.some(
            (f) => f.size > 10 * 1024 * 1024 || !f.type.startsWith('image/')
        )
    )
        throw Error('Выберите изображения размером до 10 МБ каждое.');
    const db = await database();
    const refs = files.map((f) => ({ id: crypto.randomUUID(), name: f.name }));
    try {
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction('files', 'readwrite');
            files.forEach((f, i) => tx.objectStore('files').put(f, refs[i].id));
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(Error('Не удалось сохранить фото.'));
            tx.onabort = () => reject(Error('Сохранение фото прервано.'));
        });
        return refs;
    } finally {
        db.close();
    }
}
export async function clearFiles() {
    const db = await database();
    try {
        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction('files', 'readwrite');
            tx.objectStore('files').clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(Error('Не удалось удалить файлы.'));
        });
    } finally {
        db.close();
    }
}
export function FileLink({ file }: { file: Attachment }) {
    const [error, setError] = useState('');
    async function open() {
        try {
            const db = await database();
            const data = await new Promise<Blob>((resolve, reject) => {
                const r = db
                    .transaction('files')
                    .objectStore('files')
                    .get(file.id);
                r.onsuccess = () =>
                    r.result
                        ? resolve(r.result)
                        : reject(Error('Файл не найден в этом браузере.'));
                r.onerror = () => reject(Error('Не удалось открыть файл.'));
            });
            db.close();
            const url = URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (e) {
            setError((e as Error).message);
        }
    }
    return (
        <span>
            <button type="button" className="sp-link" onClick={open}>
                {file.name}
            </button>
            {error && <span role="alert">{error}</span>}
        </span>
    );
}
