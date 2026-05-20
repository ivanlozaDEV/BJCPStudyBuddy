/**
 * SRM Color Mapping Helper for Visual SRM bars
 * Source: standard BJCP SRM charts
 */
export function getSRMColor(srm: number): string {
  if (srm <= 2.5) return '#F8F753'; // Light straw
  if (srm <= 4.5) return '#F2C75C'; // Pale gold
  if (srm <= 7.5) return '#E9A13B'; // Deep gold / orange amber
  if (srm <= 12.5) return '#C47632'; // Amber / copper
  if (srm <= 18.5) return '#944C25'; // Medium brown
  if (srm <= 24.5) return '#60310F'; // Dark brown
  if (srm <= 35.0) return '#241208'; // Very dark
  return '#080402'; // Stout Black
}

/**
 * Helper to get text contrast color based on SRM value inside the glass
 */
export function getSRMContrastColor(srm: number): string {
  // Light beer colors get charcoal text, dark beer colors get white text
  return srm <= 12.5 ? '#0A0C10' : '#FFFFFF';
}
