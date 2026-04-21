export async function checkForUpdate(): Promise<boolean> {
  try {
    const { check } = await import('@tauri-apps/plugin-updater');
    const update = await check();
    return update !== null;
  } catch {
    return false;
  }
}
