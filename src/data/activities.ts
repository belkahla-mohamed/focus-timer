import type { BreakActivity } from '@/types';

export const activities: BreakActivity[] = [
  {
    id: 'desk-reset',
    title: 'Desk reset',
    description: 'Stand up, clear one surface, and return with a cleaner field of view.',
    minBreakDuration: 1
  },
  {
    id: 'box-breathing',
    title: 'Box breathing',
    description: 'Breathe in, hold, breathe out, hold. Repeat until the timer turns.',
    minBreakDuration: 2
  },
  {
    id: 'shoulder-release',
    title: 'Shoulder release',
    description: 'Roll your shoulders slowly, then stretch your neck left and right.',
    minBreakDuration: 3
  },
  {
    id: 'window-focus',
    title: 'Distance focus',
    description: 'Look out a window or across the room to rest your eyes.',
    minBreakDuration: 4
  },
  {
    id: 'walk-water',
    title: 'Water walk',
    description: 'Refill your glass and take a short walk before settling back in.',
    minBreakDuration: 5
  },
  {
    id: 'full-reset',
    title: 'Full reset',
    description: 'Leave the desk, move your legs, hydrate, and return on purpose.',
    minBreakDuration: 10
  }
];
