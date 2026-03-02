import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { COLUMNS, GAME_TYPE_COLORS } from "../constants/columns";
import { formatVal } from "../utils/format";
import type { PlayerStatRow, SortState, SortDir } from "../types/stats";

interface Props {
  rows: PlayerStatRow[];
  sortState: SortState;
  onSort: (col: keyof PlayerStatRow) => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span style={{ opacity: 0.2, marginLeft: 3 }}>↕</span>;
  return (
    <span style={{ color: "#f59e0b", marginLeft: 3 }}>
      {dir === "asc" ? "↑" : "↓"}
    </span>
  );
}

const ROW_HEIGHT = 34;

export default function ResultsTable({ rows, sortState, onSort }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();

  return (
    <div
      style={{
        border: "1px solid #141b27",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {/* Sticky header */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            {COLUMNS.map((col) => (
              <col
                key={col.key}
                style={{
                  width:
                    col.type === "text" ? 110 : col.type === "date" ? 96 : 68,
                }}
              />
            ))}
          </colgroup>
          <thead>
            <tr
              style={{
                background: "var(--bg-surface)",
                borderBottom: "2px solid #1a2235",
              }}
            >
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="th-btn"
                  onClick={() => onSort(col.key)}
                  style={{
                    padding: "9px 11px",
                    textAlign:
                      col.type === "text" || col.type === "date"
                        ? "left"
                        : "right",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: sortState.col === col.key ? "#f59e0b" : "#4a5568",
                    borderRight: "1px solid #141b27",
                    userSelect: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col.label}
                  <SortIcon
                    active={sortState.col === col.key}
                    dir={sortState.dir}
                  />
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Virtualised body */}
      <div
        ref={parentRef}
        style={{
          height: Math.min(rows.length * ROW_HEIGHT, 600),
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        {rows.length === 0 ? (
          <div
            style={{
              padding: "44px 20px",
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: 13,
            }}
          >
            No results match the current filters.
          </div>
        ) : (
          <div style={{ height: totalHeight, position: "relative" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                tableLayout: "fixed",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <colgroup>
                {COLUMNS.map((col) => (
                  <col
                    key={col.key}
                    style={{
                      width:
                        col.type === "text"
                          ? 110
                          : col.type === "date"
                            ? 96
                            : 68,
                    }}
                  />
                ))}
              </colgroup>
              <tbody>
                {virtualItems.map((vItem) => {
                  const row = rows[vItem.index];
                  const isEven = vItem.index % 2 === 0;

                  return (
                    <tr
                      key={vItem.index}
                      className="row-hover"
                      style={{
                        position: "absolute",
                        top: vItem.start,
                        left: 0,
                        width: "100%",
                        height: ROW_HEIGHT,
                        background: isEven
                          ? "var(--bg-row-even)"
                          : "var(--bg-row-odd)",
                        display: "flex",
                      }}
                    >
                      {COLUMNS.map((col) => {
                        const raw = row[col.key] as unknown;
                        const fmtd = formatVal(raw, col.type);
                        let extraStyle: React.CSSProperties = {};

                        if (col.key === "points") {
                          const n = parseFloat(String(raw));
                          if (n >= 40)
                            extraStyle = { color: "#f59e0b", fontWeight: 700 };
                          else if (n >= 20) extraStyle = { color: "#68d391" };
                        }
                        if (
                          col.key === "plusMinusPoints" &&
                          parseFloat(String(raw)) < 0
                        ) {
                          extraStyle = { color: "#fc8181" };
                        }
                        if (col.key === "gameType" && raw) {
                          const c = GAME_TYPE_COLORS[String(raw)];
                          if (c) extraStyle = { color: c, fontWeight: 600 };
                        }

                        const colWidth =
                          col.type === "text"
                            ? 110
                            : col.type === "date"
                              ? 96
                              : 68;

                        return (
                          <td
                            key={col.key}
                            style={{
                              padding: "0 11px",
                              width: colWidth,
                              minWidth: colWidth,
                              height: ROW_HEIGHT,
                              display: "flex",
                              alignItems: "center",
                              justifyContent:
                                col.type === "text" || col.type === "date"
                                  ? "flex-start"
                                  : "flex-end",
                              borderRight: "1px solid #0f1420",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: Object.keys(extraStyle).length
                                ? undefined
                                : col.type === "text"
                                  ? "#cbd5e0"
                                  : col.type === "date"
                                    ? "#4a5568"
                                    : "#8899a6",
                              ...extraStyle,
                            }}
                          >
                            {fmtd}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
