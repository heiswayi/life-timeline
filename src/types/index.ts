
export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  significance: number; // 1-100
  color?: string;
}

export interface TimelineConfig {
  startYear: number;
  endYear: number;
  yearSpacing: number; // pixels per year
  showFutureYears: boolean;
  highlightCurrentYear: boolean;
}
