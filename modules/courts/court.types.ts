export interface CourtListItem {
  id: number;
  name: string;
  sport: string;
  description: string | null;
  pricePerHour: number;
  active: boolean;
}

export interface CreateCourtInput {
  name: string;
  sport: string;
  description: string | null;
  pricePerHour: number;
}

export interface UpdateCourtInput {
  name: string;
  sport: string;
  description: string | null;
  pricePerHour: number;
  active: boolean;
}