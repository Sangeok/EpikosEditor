import { roundTime } from "@/shared/lib/timeConversion";

const MINIMUM_ELEMENT_DURATION = 0.1;

// Validate the start time of the timeline element(Using left resize)
export function validateStartTime(
  candidateStartTime: number,
  minStartTime: number,
  originalEndTime: number
): number {
  let newStartTime = Math.max(minStartTime, candidateStartTime);
  newStartTime = roundTime(newStartTime);

  const minAllowedStartTime = roundTime(
    originalEndTime - MINIMUM_ELEMENT_DURATION
  );
  const wouldStartTimeExceedEndTime = newStartTime >= originalEndTime;

  if (wouldStartTimeExceedEndTime) {
    newStartTime = minAllowedStartTime;
  }

  return newStartTime;
}

// Validate the end time of the timeline element(Using right resize)
export function validateEndTime(
  candidateEndTime: number,
  originalStartTime: number
): number {
  const minAllowedEndTime = originalStartTime + MINIMUM_ELEMENT_DURATION;
  return Math.max(minAllowedEndTime, candidateEndTime);
}

export { MINIMUM_ELEMENT_DURATION };
