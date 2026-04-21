export function initDesktopStorage(): void {
  try {
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      console.log('[Desktop] Running in Tauri environment, localStorage will be used via webview');
    }
  } catch {
    // Not in Tauri environment
  }
}

export async function saveToDesktopFile(key: string, data: string): Promise<void> {
  try {
    const { BaseDirectory, writeTextFile } = await import('@tauri-apps/plugin-fs');
    await writeTextFile(`shudu_data/${key}.json`, data, {
      baseDir: BaseDirectory.AppData,
    });
  } catch {
    // Fallback to localStorage
    localStorage.setItem(key, data);
  }
}

export async function loadFromDesktopFile(key: string): Promise<string | null> {
  try {
    const { BaseDirectory, readTextFile } = await import('@tauri-apps/plugin-fs');
    return await readTextFile(`shudu_data/${key}.json`, {
      baseDir: BaseDirectory.AppData,
    });
  } catch {
    return localStorage.getItem(key);
  }
}
