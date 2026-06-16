/**
 * Dedicated utility module for complex inline mathematical formulas and layout calculations.
 * Extracted to cleanly separate business/layout logic from React components.
 */

/**
 * Generates a mock 9-digit transaction ID for UPI redemptions.
 */
export function generateTransactionId(): string {
  return `TXN${Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, '0')}`;
}

/**
 * Calculates the exact X and Y coordinates for a node on a circular orbital path.
 * 
 * @param index The index of the current node
 * @param total The total number of nodes in this orbit
 * @param radius The radius of the orbit
 * @param rotationAngle Any base rotation offset to apply (in degrees)
 * @param centerOffset The X and Y offset for the center of the orbit
 * @returns Object containing the calculated x, y, angle, radian, zIndex, and opacity
 */
export function calculateOrbitalNodePosition(
  index: number,
  total: number,
  radius: number,
  rotationAngle: number,
  centerOffset: { x: number; y: number } = { x: 0, y: 0 }
) {
  const angle = ((index / total) * 360 + rotationAngle) % 360;
  const radian = (angle * Math.PI) / 180;
  
  const x = radius * Math.cos(radian) + centerOffset.x;
  const y = radius * Math.sin(radian) + centerOffset.y;
  
  // Create a 3D effect by calculating z-index and opacity based on y/radian depth
  const zIndex = Math.round(100 + 50 * Math.cos(radian));
  const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

  return { x, y, angle, radian, zIndex, opacity };
}

/**
 * Calculates the SVG stroke-dash offset for a circular progress ring.
 * 
 * @param score The current score (0-100)
 * @param dashArray The total circumference/dash-array of the SVG circle
 */
export function calculateSvgDashOffset(score: number, dashArray: number): number {
  return dashArray - (dashArray * score) / 100;
}
