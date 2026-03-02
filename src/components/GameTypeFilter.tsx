import { GAME_TYPE_COLORS, GAME_TYPE_LABELS } from "../constants/columns";

interface Props {
  gameTypes: string[];
  activeTypes: string[];
  onToggle: (gt: string) => void;
  onClearAll: () => void;
}

export default function GameTypeFilter({
  gameTypes,
  activeTypes,
  onToggle,
  onClearAll,
}: Props) {
  if (gameTypes.length === 0) return null;

  return (
    <div
      style={{
        background: "#0d1017",
        border: "1px solid #141b27",
        borderRadius: 6,
        padding: "14px 20px",
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <span className="section-label" style={{ marginRight: 4 }}>
        GAME TYPE
      </span>

      {/* ALL */}
      <button
        className="gt-btn"
        onClick={onClearAll}
        style={
          activeTypes.length === 0
            ? {
                background: "rgba(255,255,255,0.06)",
                borderColor: "#718096",
                color: "#e2e8f0",
              }
            : {}
        }
      >
        ALL
      </button>

      {gameTypes.map((gt) => {
        const active = activeTypes.includes(gt);
        const accent = GAME_TYPE_COLORS[gt] ?? "#a0aec0";
        const label = GAME_TYPE_LABELS[gt] ?? gt;
        return (
          <button
            key={gt}
            className="gt-btn"
            onClick={() => onToggle(gt)}
            style={
              active
                ? {
                    background: `${accent}1a`,
                    borderColor: accent,
                    color: accent,
                  }
                : {}
            }
          >
            {label}
          </button>
        );
      })}

      {activeTypes.length > 1 && (
        <span
          style={{
            fontSize: 11,
            color: "#374151",
            marginLeft: 4,
            fontStyle: "italic",
          }}
        >
          multiple = OR
        </span>
      )}
    </div>
  );
}
