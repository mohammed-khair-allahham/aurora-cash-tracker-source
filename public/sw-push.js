let _timer = null;

function nextOccurrence(h, m) {
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= new Date()) next.setDate(next.getDate() + 1);
  return next;
}

async function cancelExisting() {
  const existing = await self.registration.getNotifications({
    tag: 'daily-reminder',
    includeTriggered: true,
  });
  existing.forEach(n => n.close());
}

self.addEventListener('message', async (event) => {
  if (event.data?.type !== 'SCHEDULE_NOTIFICATION') return;
  const { time, title, body, icon } = event.data;
  const [h, m] = time.split(':').map(Number);

  // Chrome: Notification Triggers API — OS-level scheduling, fires even when browser is closed
  if ('TimestampTrigger' in self) {
    await cancelExisting();
    const next = nextOccurrence(h, m);
    await self.registration.showNotification(title, {
      body,
      icon,
      tag: 'daily-reminder',
      showTrigger: new TimestampTrigger(next.getTime()),
      data: { h, m, title, body, icon },
    });
    return;
  }

  // Fallback: setTimeout (requires SW to stay alive — works in foreground/recent background)
  clearTimeout(_timer);
  const schedule = () => {
    const next = nextOccurrence(h, m);
    _timer = setTimeout(async () => {
      await self.registration.showNotification(title, { body, icon });
      schedule();
    }, next - new Date());
  };
  schedule();
});

// After a TimestampTrigger fires (once), re-schedule the next day's occurrence
async function rescheduleNextDay(notification) {
  const d = notification.data;
  if (!d || !('TimestampTrigger' in self)) return;
  const next = new Date();
  next.setHours(d.h, d.m, 0, 0);
  next.setDate(next.getDate() + 1);
  await self.registration.showNotification(d.title, {
    body: d.body,
    icon: d.icon,
    tag: 'daily-reminder',
    showTrigger: new TimestampTrigger(next.getTime()),
    data: d,
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    Promise.all([
      rescheduleNextDay(event.notification),
      clients.matchAll({ type: 'window' }).then(cs => {
        if (cs.length > 0) return cs[0].focus();
        return clients.openWindow(self.registration.scope);
      }),
    ])
  );
});

self.addEventListener('notificationclose', (event) => {
  event.waitUntil(rescheduleNextDay(event.notification));
});
