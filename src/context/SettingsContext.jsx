import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

import { DEFAULT_SETTINGS } from "../lib/default-settings";
export { DEFAULT_SETTINGS };

const SettingsContext = createContext({ settings: DEFAULT_SETTINGS, loading: true, reload: () => {} });

// Deep merge helper: fills missing keys from defaults
function merge(target, source) {
  if (Array.isArray(source)) return source;
  if (source && typeof source === "object") {
    const out = { ...target };
    for (const k of Object.keys(source)) out[k] = merge(target?.[k], source[k]);
    for (const k of Object.keys(target || {})) if (!(k in out)) out[k] = target[k];
    return out;
  }
  return source === undefined ? target : source;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    try {
      const r = await api.get("/settings");
      setSettings(merge(DEFAULT_SETTINGS, r.data || {}));
    } catch (_) { /* keep defaults */ }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return <SettingsContext.Provider value={{ settings, loading, reload }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
