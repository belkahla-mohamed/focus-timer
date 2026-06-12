import { BreakPage } from '@/pages/BreakPage';
import { TimerPage } from '@/pages/TimerPage';

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const view = searchParams.get('view');

  if (view === 'break') {
    return <BreakPage />;
  }

  return <TimerPage />;
}
