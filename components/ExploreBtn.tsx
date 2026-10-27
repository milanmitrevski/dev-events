'use client';

import Image from 'next/image';
import posthog from 'posthog-js';

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export default function ExploreBtn() {
  const handleExplore = () => {
    if (isPostHogConfigured) {
      posthog.capture('events_explored');
    }
  };

  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto">
      <a href="#events" onClick={handleExplore}>
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="arrow-down"
          width={24}
          height={24}
        />
      </a>
    </button>
  );
}
