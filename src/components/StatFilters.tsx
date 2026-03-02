import type { FiltersState, FilterMode } from "../types/stats";
import {
  FILTERABLE_TEXT_COLS,
  FILTERABLE_NUMERIC_COLS,
} from "../constants/columns";

interface Props {
  filters: FiltersState;
  onFilterChange: (key: string, value: string | undefined) => void;
  onModeChange: (key: string, mode: FilterMode) => void;
}

export default function StatFilters({
  filters,
  onFilterChange,
  onModeChange,
}: Props) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid #141b27",
        borderRadius: 6,
        padding: "18px 22px",
      }}
    >
      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          fontSize: 11,
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "var(--text-secondary)" }}>
          Numeric mode per column:
        </span>
        <span>
          <span style={{ color: "#68d391", fontWeight: 700 }}>≥</span>
          <span style={{ color: "var(--text-faint)" }}> at least</span>
        </span>
        <span style={{ color: "var(--text-faint)" }}>·</span>
        <span>
          <span style={{ color: "#fc8181", fontWeight: 700 }}>≤</span>
          <span style={{ color: "var(--text-faint)" }}> at most</span>
        </span>
        <span style={{ color: "var(--text-faint)" }}>·</span>
        <span>
          <span style={{ color: "#f59e0b", fontWeight: 700 }}>=</span>
          <span style={{ color: "var(--text-faint)" }}> exact</span>
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
          gap: "12px 16px",
        }}
      >
        {/* Text filters */}
        {FILTERABLE_TEXT_COLS.map((col) => (
          <div key={col.key}>
            <label
              className="section-label"
              style={{ display: "block", marginBottom: 5 }}
            >
              {col.label}
            </label>
            <input
              className="filter-input"
              placeholder={
                col.label === "First"
                  ? "e.g. LeBron"
                  : col.label === "Last"
                    ? "e.g. James"
                    : col.label === "Team"
                      ? "e.g. Lakers"
                      : col.label === "Opp"
                        ? "e.g. Celtics"
                        : "filter…"
              }
              value={filters[col.key]?.value ?? ""}
              onChange={(e) =>
                onFilterChange(col.key, e.target.value || undefined)
              }
            />
          </div>
        ))}

        {/* Numeric / percent filters */}
        {FILTERABLE_NUMERIC_COLS.map((col) => {
          const f = filters[col.key];
          const mode = f?.mode ?? "gte";
          const active = f?.value !== undefined && f.value !== "";
          const borderColor = active
            ? mode === "gte"
              ? "#68d391"
              : mode === "lte"
                ? "#fc8181"
                : "#f59e0b"
            : undefined;

          return (
            <div key={col.key}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <label className="section-label">{col.label}</label>
                <div style={{ display: "flex", gap: 3 }}>
                  {(["gte", "lte", "exact"] as FilterMode[]).map((m) => (
                    <button
                      key={m}
                      className={`mpill ${mode === m ? `mpill-${m}` : ""}`}
                      onClick={() => onModeChange(col.key, m)}
                      title={
                        m === "gte"
                          ? "At least (≥)"
                          : m === "lte"
                            ? "At most (≤)"
                            : "Exact (=)"
                      }
                    >
                      {m === "gte" ? "≥" : m === "lte" ? "≤" : "="}
                    </button>
                  ))}
                </div>
              </div>
              <input
                className="filter-input"
                type="number"
                placeholder={col.type === "percent" ? "e.g. 50" : "e.g. 30"}
                value={f?.value ?? ""}
                onChange={(e) =>
                  onFilterChange(
                    col.key,
                    e.target.value === "" ? undefined : e.target.value,
                  )
                }
                style={{ borderColor }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
