export function getCourtImage(
  sport: string
): string {
  const normalizedSport =
    sport.toLowerCase();

  if (
    normalizedSport.includes("vóley") ||
    normalizedSport.includes("voley")
  ) {
    return "/images/voley.jpg";
  }

  if (
    normalizedSport.includes("7")
  ) {
    return "/images/futbol-7.jpg";
  }

  return "/images/futbol-5.jpg";
}