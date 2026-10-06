export const SAVED_STATE_STORAGE_KEY = "husain-portfolio:saved-filesystem-state";

export interface SavedFilesystemData {
  customNames: Record<string, string>;
  folderOrders: Record<string, string[]>;
  quickAccessIds: string[];
}

export interface SavedStatePayload {
  version: number;
  filesystem: SavedFilesystemData;
  savedAt?: string;
}

/**
 * Safely parse and validate saved filesystem state from browser localStorage.
 * Returns null if data does not exist, cannot be parsed, or fails schema validation.
 */
export function loadSavedState(): SavedFilesystemData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(SAVED_STATE_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.version !== 1 ||
      !parsed.filesystem ||
      typeof parsed.filesystem !== "object"
    ) {
      return null;
    }

    const { filesystem } = parsed;

    // Validate and clean customNames
    const customNames: Record<string, string> = {};
    if (filesystem.customNames && typeof filesystem.customNames === "object" && !Array.isArray(filesystem.customNames)) {
      for (const [key, val] of Object.entries(filesystem.customNames)) {
        if (typeof key === "string" && typeof val === "string" && val.trim().length > 0) {
          customNames[key] = val;
        }
      }
    }

    // Validate and clean folderOrders
    const folderOrders: Record<string, string[]> = {};
    if (filesystem.folderOrders && typeof filesystem.folderOrders === "object" && !Array.isArray(filesystem.folderOrders)) {
      for (const [key, val] of Object.entries(filesystem.folderOrders)) {
        if (typeof key === "string" && Array.isArray(val)) {
          folderOrders[key] = val.filter((item): item is string => typeof item === "string");
        }
      }
    }

    // Validate quickAccessIds
    let quickAccessIds: string[] | undefined = undefined;
    if (Array.isArray(filesystem.quickAccessIds)) {
      quickAccessIds = filesystem.quickAccessIds.filter((item: unknown): item is string => typeof item === "string");
    }

    return {
      customNames,
      folderOrders,
      quickAccessIds: quickAccessIds ?? [],
    };
  } catch {
    return null;
  }
}

/**
 * Persist current filesystem customization snapshot into browser localStorage.
 */
export function persistSavedState(data: SavedFilesystemData): boolean {
  if (typeof window === "undefined") return false;

  try {
    const payload: SavedStatePayload = {
      version: 1,
      filesystem: {
        customNames: data.customNames || {},
        folderOrders: data.folderOrders || {},
        quickAccessIds: data.quickAccessIds || [],
      },
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(SAVED_STATE_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

/**
 * Remove persisted filesystem snapshot from localStorage.
 */
export function clearSavedState(): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.removeItem(SAVED_STATE_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if current in-memory filesystem customization matches a given baseline.
 */
export function areFilesystemStatesEqual(
  current: SavedFilesystemData,
  baseline: SavedFilesystemData | null,
  defaultQuickAccessIds: string[]
): boolean {
  const baseNames = baseline?.customNames || {};
  const baseOrders = baseline?.folderOrders || {};
  const baseQA = baseline?.quickAccessIds && baseline.quickAccessIds.length > 0
    ? baseline.quickAccessIds
    : defaultQuickAccessIds;

  // Compare customNames
  const currentNameKeys = Object.keys(current.customNames);
  const baseNameKeys = Object.keys(baseNames);
  if (currentNameKeys.length !== baseNameKeys.length) return false;
  for (const k of currentNameKeys) {
    if (current.customNames[k] !== baseNames[k]) return false;
  }

  // Compare folderOrders
  const currentOrderKeys = Object.keys(current.folderOrders);
  const baseOrderKeys = Object.keys(baseOrders);
  if (currentOrderKeys.length !== baseOrderKeys.length) return false;
  for (const k of currentOrderKeys) {
    const currArr = current.folderOrders[k] || [];
    const baseArr = baseOrders[k] || [];
    if (currArr.length !== baseArr.length) return false;
    for (let i = 0; i < currArr.length; i++) {
      if (currArr[i] !== baseArr[i]) return false;
    }
  }

  // Compare quickAccessIds
  const currentQA = current.quickAccessIds;
  if (currentQA.length !== baseQA.length) return false;
  for (let i = 0; i < currentQA.length; i++) {
    if (currentQA[i] !== baseQA[i]) return false;
  }

  return true;
}
