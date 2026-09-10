export interface CourtListItem {
  id: number;
  name: string;
  sport: string;
  description: string | null;
  pricePerHour: number;
  active: boolean;
}