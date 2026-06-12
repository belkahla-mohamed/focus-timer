import { useMemo } from 'react';
import { activities } from '@/data/activities';

export const useBreakActivity = (breakDuration: number) => {
  return useMemo(() => {
    const eligibleActivities = activities.filter((activity) => activity.minBreakDuration <= breakDuration);
    const source = eligibleActivities.length > 0 ? eligibleActivities : activities;
    const index = Math.floor(Math.random() * source.length);

    return source[index];
  }, [breakDuration]);
};
