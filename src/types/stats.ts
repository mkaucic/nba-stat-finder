export interface PlayerStatRow {
  firstName:                 string;
  lastName:                  string;
  personId:                  number;
  gameId:                    number;
  gameDateTimeEst:           string;
  gameType:                  string;
  gameLabel:                 string | null;
  gameSubLabel:              string | null;
  seriesGameNumber:          string | null;
  playerteamCity:            string;
  playerteamName:            string;
  opponentteamCity:          string;
  opponentteamName:          string;
  win:                       number;
  home:                      number;
  numMinutes:                number;
  points:                    number;
  fieldGoalsAttempted:       number;
  fieldGoalsMade:            number;
  fieldGoalsPercentage:      number;
  threePointersAttempted:    number;
  threePointersMade:         number;
  threePointersPercentage:   number;
  freeThrowsAttempted:       number;
  freeThrowsMade:            number;
  freeThrowsPercentage:      number;
  reboundsDefensive:         number;
  reboundsOffensive:         number;
  reboundsTotal:             number;
  assists:                   number;
  blocks:                    number;
  steals:                    number;
  turnovers:                 number;
  foulsPersonal:             number;
  plusMinusPoints:           number;
}

export type GameType = string;
export type FilterMode = "gte" | "lte" | "exact";

export interface ColumnFilter {
  value: string;
  mode:  FilterMode;
}

export type FiltersState = Partial<Record<keyof PlayerStatRow, ColumnFilter>>;
export type ColumnType = "text" | "number" | "percent" | "date";

export interface ColumnDef {
  key:        keyof PlayerStatRow;
  label:      string;
  type:       ColumnType;
  filterable: boolean;
}

export type SortDir = "asc" | "desc";

export interface SortState {
  col: keyof PlayerStatRow;
  dir: SortDir;
}