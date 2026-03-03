import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  PlayerStatRow,
  FiltersState,
  FilterMode,
  SortState,
} from "./types/stats";
import { COLUMNS } from "./constants/columns";
import { passesFilter } from "./utils/format";
import FileLoader from "./components/FileLoader";
import GameTypeFilter from "./components/GameTypeFilter";
import StatFilters from "./components/StatFilters";
import ResultsTable from "./components/ResultsTable";
import Pagination from "./components/Pagination";

const PAGE_SIZE = 200;

export default function App() {
  const [rows, setRows] = useState<PlayerStatRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [filters, setFilters] = useState<FiltersState>({});
  const [gameTypeFilter, setGameTypeFilter] = useState<string[]>([]);
  const [sortState, setSortState] = useState<SortState>({
    col: "gameDateTimeEst",
    dir: "desc",
  });
  const [page, setPage] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // ── Apply theme to document root so CSS variables cascade everywhere ──────
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ── Parse via Web Worker ──────────────────────────────────────────────────
  const handleFile = useCallback((file: File) => {
    setLoading(true);
    setLoadMsg("Starting worker…");

    const worker = new Worker(
      new URL("./workers/csvParser.worker.ts", import.meta.url),
      { type: "module" },
    );

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === "progress") {
        setLoadMsg(msg.message);
      } else if (msg.type === "complete") {
        setRows(msg.rows);
        setLoading(false);
        setLoadMsg(
          `✓ Loaded ${(msg.rows as PlayerStatRow[]).length.toLocaleString()} rows`,
        );
        setFilters({});
        setGameTypeFilter([]);
        setPage(0);
        worker.terminate();
      } else if (msg.type === "error") {
        setLoading(false);
        setLoadMsg("Error: " + msg.message);
        worker.terminate();
      }
    };

    worker.postMessage({ file });
  }, []);

  // ── Filter helpers ────────────────────────────────────────────────────────
  const updateFilter = useCallback((key: string, value: string | undefined) => {
    setFilters((f) => {
      const next = { ...f } as FiltersState;
      const k = key as keyof PlayerStatRow;
      if (value === undefined || value === "") {
        delete next[k];
      } else {
        next[k] = { value, mode: next[k]?.mode ?? "gte" };
      }
      return next;
    });
    setPage(0);
  }, []);

  const updateMode = useCallback((key: string, mode: FilterMode) => {
    setFilters((f) => {
      const next = { ...f } as FiltersState;
      const k = key as keyof PlayerStatRow;
      if (next[k]) next[k] = { ...next[k]!, mode };
      return next;
    });
    setPage(0);
  }, []);

  const toggleGameType = useCallback((gt: string) => {
    setGameTypeFilter((prev) =>
      prev.includes(gt) ? prev.filter((x) => x !== gt) : [...prev, gt],
    );
    setPage(0);
  }, []);

  const clearAll = useCallback(() => {
    setFilters({});
    setGameTypeFilter([]);
    setPage(0);
  }, []);

  // ── Derived game types ────────────────────────────────────────────────────
  const gameTypes = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.gameType) set.add(r.gameType);
    });
    return [...set].sort();
  }, [rows]);

  // ── Filter + sort ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!rows.length) return [];
    return rows.filter((row) => {
      if (gameTypeFilter.length > 0 && !gameTypeFilter.includes(row.gameType))
        return false;
      for (const [key, f] of Object.entries(filters)) {
        if (!f) continue;
        const col = COLUMNS.find((c) => c.key === key);
        if (!col) continue;
        const rowVal = row[key as keyof PlayerStatRow];
        if (!passesFilter(rowVal, f.value, col.type, f.mode)) return false;
      }
      return true;
    });
  }, [rows, filters, gameTypeFilter]);

  const sorted = useMemo(() => {
    const { col, dir } = sortState;
    return [...filtered].sort((a, b) => {
      const av = a[col],
        bv = b[col];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "string")
        return dir === "asc"
          ? av.localeCompare(String(bv))
          : String(bv).localeCompare(av);
      return dir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [filtered, sortState]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = useMemo(
    () => sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [sorted, page],
  );

  const handleSort = useCallback((col: keyof PlayerStatRow) => {
    setSortState((s) => ({
      col,
      dir: s.col === col ? (s.dir === "asc" ? "desc" : "asc") : "desc",
    }));
    setPage(0);
  }, []);

  const [logoBounce, setLogoBounce] = useState(false);

  const handleLogoClick = () => {
    setLogoBounce(true);
    setTimeout(() => setLogoBounce(false), 400);
    setRows([]);
    setFilters({});
    setGameTypeFilter([]);
    setPage(0);
    setLoadMsg("");
  };

  const activeFilterCount =
    Object.keys(filters).length + (gameTypeFilter.length > 0 ? 1 : 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          background:
            "linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%)",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo / home button */}
        <button
          onClick={handleLogoClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px 4px 0",
            borderRadius: 6,
            transform: logoBounce ? "scale(0.93)" : "scale(1)",
            transition:
              "transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          title="Go to home"
        >
          <img
            src="/logo-192.png"
            alt="NSF logo"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              transform: logoBounce ? "rotate(-12deg)" : "rotate(0deg)",
              transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: "0.04em",
              color: "var(--text-primary)",
            }}
          >
            NBA<span style={{ color: "var(--accent)" }}>STAT</span>FINDER
          </span>
          <span
            className="section-label"
            style={{ color: "var(--text-deep)", fontSize: 10 }}
          >
            HISTORICAL BOX SCORES
          </span>
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 11,
            color: "var(--text-faint)",
          }}
        >
          {rows.length > 0 && (
            <span>
              <span style={{ color: "var(--text-muted)" }}>
                {rows.length.toLocaleString()}
              </span>{" "}
              rows
            </span>
          )}
          {sorted.length !== rows.length && rows.length > 0 && (
            <span className="badge">
              {sorted.length.toLocaleString()} matches
            </span>
          )}
          <button
            onClick={toggleTheme}
            className="btn-ghost"
            style={{ padding: "4px 10px", fontSize: 16, lineHeight: 1 }}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 32px", maxWidth: 1900, margin: "0 auto" }}>
        {/* ── File loader ─────────────────────────────────────────────── */}
        {rows.length === 0 && !loading && (
          <FileLoader onFile={handleFile} loadMsg={loadMsg} />
        )}

        {/* ── Loading overlay ──────────────────────────────────────────── */}
        {loading && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--bg-base)",
              opacity: 0.95,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
          >
            <div
              className="pulse"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 52,
                fontWeight: 800,
                color: "var(--accent)",
                letterSpacing: "0.06em",
              }}
            >
              PARSING…
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                marginTop: 14,
                fontSize: 13,
              }}
            >
              {loadMsg}
            </p>
            <p
              style={{ color: "var(--text-faint)", fontSize: 11, marginTop: 8 }}
            >
              Running in background thread — UI stays responsive
            </p>
          </div>
        )}

        {/* ── Search panel ─────────────────────────────────────────────── */}
        {rows.length > 0 && (
          <div className="fade-in" style={{ marginBottom: 24 }}>
            {/* Top bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              <span className="section-label">FILTERS</span>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {activeFilterCount > 0 && (
                  <>
                    <span className="badge">
                      {activeFilterCount} filter
                      {activeFilterCount !== 1 ? "s" : ""} active
                    </span>
                    <button className="btn-ghost" onClick={clearAll}>
                      CLEAR ALL
                    </button>
                  </>
                )}
                <label>
                  <span className="btn-ghost" style={{ cursor: "pointer" }}>
                    LOAD NEW FILE
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            <GameTypeFilter
              gameTypes={gameTypes}
              activeTypes={gameTypeFilter}
              onToggle={toggleGameType}
              onClearAll={() => {
                setGameTypeFilter([]);
                setPage(0);
              }}
            />

            <StatFilters
              filters={filters}
              onFilterChange={updateFilter}
              onModeChange={updateMode}
            />
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────────── */}
        {rows.length > 0 && (
          <div className="fade-in">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="section-label">RESULTS</span>
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "var(--accent)",
                  }}
                >
                  {sorted.length.toLocaleString()}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                  stat line{sorted.length !== 1 ? "s" : ""}
                  {activeFilterCount > 0
                    ? ` · ${activeFilterCount} filter${activeFilterCount !== 1 ? "s" : ""} active`
                    : ""}
                </span>
              </div>
              <Pagination page={page} total={totalPages} setPage={setPage} />
            </div>

            <ResultsTable
              rows={paged}
              sortState={sortState}
              onSort={handleSort}
            />

            <div style={{ marginTop: 14 }}>
              <Pagination
                page={page}
                total={totalPages}
                setPage={setPage}
                center
              />
            </div>
          </div>
        )}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          style={{
            marginTop: 48,
            paddingTop: 18,
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            fontSize: 11,
            color: "var(--text-deep)",
          }}
        >
          <span>
            Data:{" "}
            <a
              href="https://www.kaggle.com/datasets/eoinamoore/historical-nba-data-and-player-box-scores"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "var(--text-faint)",
                textDecoration: "underline",
              }}
            >
              Historical NBA Data & Player Box Scores
            </a>{" "}
            by{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>
              Eoin A. Moore
            </span>{" "}
            on Kaggle.
          </span>
          <span style={{ color: "var(--text-deep)" }}>
            NBA STAT FINDER · personal & research use only
          </span>
        </footer>
      </div>
    </div>
  );
}
