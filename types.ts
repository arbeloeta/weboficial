export type BetStatus = 'pending' | 'won' | 'lost';
export type BetType = 'simple' | 'combined';

export interface BetEvent {
  description: string;
  odds: number;
}

export interface Bet {
  id: string;
  date: string;
  description: string;
  amount: number;
  odds: number;
  status: BetStatus;
  type: BetType;
  possibleWin: number;
  events?: BetEvent[];
}