import type { ColumnDef } from "../types/stats";

export const COLUMNS: ColumnDef[] = [
  { key: "firstName",               label: "First",  type: "text",    filterable: true  },
  { key: "lastName",                label: "Last",   type: "text",    filterable: true  },
  { key: "gameDateTimeEst",         label: "Date",   type: "date",    filterable: false },
  { key: "playerteamName",          label: "Team",   type: "text",    filterable: true  },
  { key: "opponentteamName",        label: "Opp",    type: "text",    filterable: true  },
  { key: "gameType",                label: "Type",   type: "text",    filterable: false },
  { key: "numMinutes",              label: "MIN",    type: "number",  filterable: true  },
  { key: "points",                  label: "PTS",    type: "number",  filterable: true  },
  { key: "assists",                 label: "AST",    type: "number",  filterable: true  },
  { key: "reboundsTotal",           label: "REB",    type: "number",  filterable: true  },
  { key: "reboundsDefensive",       label: "DREB",   type: "number",  filterable: true  },
  { key: "reboundsOffensive",       label: "OREB",   type: "number",  filterable: true  },
  { key: "blocks",                  label: "BLK",    type: "number",  filterable: true  },
  { key: "steals",                  label: "STL",    type: "number",  filterable: true  },
  { key: "turnovers",               label: "TO",     type: "number",  filterable: true  },
  { key: "foulsPersonal",           label: "PF",     type: "number",  filterable: true  },
  { key: "fieldGoalsAttempted",     label: "FGA",    type: "number",  filterable: true  },
  { key: "fieldGoalsMade",          label: "FGM",    type: "number",  filterable: true  },
  { key: "fieldGoalsPercentage",    label: "FG%",    type: "percent", filterable: true  },
  { key: "threePointersAttempted",  label: "3PA",    type: "number",  filterable: true  },
  { key: "threePointersMade",       label: "3PM",    type: "number",  filterable: true  },
  { key: "threePointersPercentage", label: "3P%",    type: "percent", filterable: true  },
  { key: "freeThrowsAttempted",     label: "FTA",    type: "number",  filterable: true  },
  { key: "freeThrowsMade",          label: "FTM",    type: "number",  filterable: true  },
  { key: "freeThrowsPercentage",    label: "FT%",    type: "percent", filterable: true  },
  { key: "plusMinusPoints",         label: "+/-",    type: "number",  filterable: true  },
];

export const FILTERABLE_TEXT_COLS    = COLUMNS.filter(c => c.type === "text"    && c.filterable);
export const FILTERABLE_NUMERIC_COLS = COLUMNS.filter(c => (c.type === "number" || c.type === "percent") && c.filterable);

export const GAME_TYPE_COLORS: Record<string, string> = {
  "Regular Season": "#60a5fa",
  "Playoffs":       "#f59e0b",
  "Pre Season":     "#a78bfa",
  "Play-In":        "#34d399",
  "IST":            "#f472b6",
};

export const GAME_TYPE_LABELS: Record<string, string> = {
  "Regular Season": "Regular Season",
  "Playoffs":       "Playoffs",
  "Pre Season":     "Pre-Season",
  "Play-In":        "Play-In",
  "IST":            "In-Season Tournament",
};