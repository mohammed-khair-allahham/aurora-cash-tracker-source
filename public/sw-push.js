let _timer = null;

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'SCHEDULE_NOTIFICATION') return;
  const { time, title, body, icon } = event.data;
  clearTimeout(_timer);
  const schedule = () => {
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    const next = new Date();
    next.setHours(h, m, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    _timer = setTimeout(async () => {
      await self.registration.showNotification(title, { body, icon });
      schedule();
    }, next - now);
  };
  schedule();
});
