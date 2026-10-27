import { SeverityNumber } from '@opentelemetry/api-logs';
import { after } from 'next/server';
import EventCard from '@/components/EventCard';
import ExploreBtn from '@/components/ExploreBtn';
import { loggerProvider, posthogLogLogger } from '@/instrumentation';
import { IEvent } from '@/database';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Page() {
  'use cache';
  cacheLife('hours');

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  posthogLogLogger?.emit({
    body: 'Featured event catalog rendered',
    severityNumber: SeverityNumber.INFO,
    attributes: { featured_event_count: events.length },
  });

  if (loggerProvider) {
    const activeLoggerProvider = loggerProvider;
    after(async () => {
      await activeLoggerProvider.forceFlush();
    });
  }

  return (
    <section>
      <h1 className="text-center">
        The Hub For Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
