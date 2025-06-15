async function trackEventAsync(eventName: string, eventData = {}): Promise<string | undefined> {
  return await umami.track(eventName, eventData);
}

export function trackEvent(eventName: string, eventData = {}): void {
  void trackEventAsync(eventName, eventData);
}
