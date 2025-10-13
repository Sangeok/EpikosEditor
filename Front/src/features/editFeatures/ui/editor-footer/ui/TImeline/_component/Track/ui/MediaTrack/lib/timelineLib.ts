// // Calculate timeline position in pixels
// export function calculateTimelinePosition(time: number, pixelsPerSecond: number): number {
//   return time * pixelsPerSecond;
// }

// // Calculate element width in pixels
// export function calculateElementWidth(startTime: number, endTime: number, pixelsPerSecond: number): number {
//   return (endTime - startTime) * pixelsPerSecond;
// }

// // Check if element is currently being dragged
// export function isElementDragging(
//   elementId: string,
//   dragState: { isDragging: boolean; elementId: string | null }
// ): boolean {
//   return dragState.isDragging && dragState.elementId === elementId;
// }

// // Format time display for tooltip
// export function formatTimeDisplay(startTime: number, endTime: number): string {
//   return `${startTime.toFixed(1)}s - ${endTime.toFixed(1)}s`;
// }
