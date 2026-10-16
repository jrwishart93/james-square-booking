import { describe, expect, it } from "vitest";
import { DEFAULT_MEETINGS } from "@/lib/committeeMeetings";
import {
  MINUTES,
  minutesActions,
  minutesFor,
  publishedMinutes,
} from "@/lib/committeeMinutes";

describe("committee minutes", () => {
  it("belongs to a known meeting on the same date", () => {
    for (const m of MINUTES) {
      const meeting = DEFAULT_MEETINGS.find((d) => d.id === m.meetingId);
      expect(meeting?.date).toBe(m.date);
    }
  });
  it("lists the most recent minutes first", () => {
    const dates = publishedMinutes().map((m) => m.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });
  it("collects every ongoing action with its section", () => {
    const actions = minutesActions(minutesFor("october-2026")!);
    expect(actions).toHaveLength(5);
    expect(actions[0].section).toBe("Cleaning Arrangements");
  });
});
