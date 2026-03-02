import React, { useRef } from "react";

interface Props {
  onFile: (file: File) => void;
  loadMsg: string;
}

export default function FileLoader({ onFile, loadMsg }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className="fade-in"
      style={{
        border: "1px dashed #1e2a3a",
        borderRadius: 8,
        padding: "56px 32px",
        textAlign: "center",
        background: "rgba(255,255,255,0.008)",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 40,
          fontWeight: 800,
          color: "#1e2a3a",
          marginBottom: 10,
          letterSpacing: "0.06em",
        }}
      >
        LOAD YOUR DATASET
      </div>

      <p
        style={{
          color: "#374151",
          fontSize: 13,
          maxWidth: 480,
          margin: "0 auto 28px",
          lineHeight: 1.6,
        }}
      >
        Download{" "}
        <span style={{ color: "#718096", fontWeight: 700 }}>
          PlayerStatistics.csv
        </span>{" "}
        from Kaggle and select it below. The file is ~321 MB — parsing runs in a
        background thread so the UI stays responsive.
      </p>

      <label style={{ cursor: "pointer" }}>
        <span className="btn" style={{ fontSize: 13 }}>
          📂 &nbsp;SELECT PlayerStatistics.csv
        </span>
        <input
          ref={ref}
          type="file"
          accept=".csv"
          onChange={handleChange}
          style={{ display: "none" }}
        />
      </label>

      {loadMsg && (
        <p style={{ marginTop: 16, color: "#68d391", fontSize: 12 }}>
          {loadMsg}
        </p>
      )}

      <div
        style={{
          marginTop: 44,
          paddingTop: 18,
          borderTop: "1px solid #141b27",
          color: "#1e2a3a",
          fontSize: 11,
          lineHeight: 1.7,
        }}
      >
        Data from{" "}
        <a
          href="https://www.kaggle.com/datasets/eoinamoore/historical-nba-data-and-player-box-scores"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#374151", textDecoration: "underline" }}
        >
          Kaggle — Historical NBA Data & Player Box Scores
        </a>{" "}
        by{" "}
        <span style={{ color: "#374151", fontWeight: 700 }}>Eoin A. Moore</span>
        .
      </div>
    </div>
  );
}
