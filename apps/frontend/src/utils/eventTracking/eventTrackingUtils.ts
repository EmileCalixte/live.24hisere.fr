import type {
  EventTrackingData,
  TrackedEventLabel,
  TrackedEventWithDataLabel,
  TrackedEventWithoutDataLabel,
} from "../../types/EventTracking";

async function trackEventAsync(eventName: string, eventData = {}): Promise<string | undefined> {
  return await umami.track(eventName, eventData);
}

export function trackEvent(eventName: TrackedEventWithoutDataLabel): void;
export function trackEvent<TEvent extends TrackedEventWithDataLabel>(
  eventName: TEvent,
  eventData: EventTrackingData[TEvent],
): void;
export function trackEvent(eventName: TrackedEventLabel, eventData?: object): void {
  void trackEventAsync(eventName, eventData);
}
