interface Props {
  page: number;
  total: number;
  setPage: (p: number | ((prev: number) => number)) => void;
  center?: boolean;
}

export default function Pagination({ page, total, setPage, center }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-end",
        gap: 6,
        fontSize: 11,
        color: "#4a5568",
      }}
    >
      <button
        className="btn-ghost"
        style={{ padding: "4px 10px" }}
        disabled={page === 0}
        onClick={() => setPage(0)}
      >
        «
      </button>
      <button
        className="btn-ghost"
        style={{ padding: "4px 10px" }}
        disabled={page === 0}
        onClick={() => setPage((p) => p - 1)}
      >
        ‹
      </button>
      <span style={{ minWidth: 110, textAlign: "center" }}>
        Page <span style={{ color: "#e2e8f0" }}>{page + 1}</span> of{" "}
        <span style={{ color: "#e2e8f0" }}>{total}</span>
      </span>
      <button
        className="btn-ghost"
        style={{ padding: "4px 10px" }}
        disabled={page >= total - 1}
        onClick={() => setPage((p) => p + 1)}
      >
        ›
      </button>
      <button
        className="btn-ghost"
        style={{ padding: "4px 10px" }}
        disabled={page >= total - 1}
        onClick={() => setPage(total - 1)}
      >
        »
      </button>
    </div>
  );
}
