export type HowToStep = {
  id: string;
  stepNumber: number;
  kicker: string;
  title: string;
  description: string;
  image: string;
  hotspot: {
    /**
     * EDIT THESE to move the circle.
     * x/y are normalised coordinates inside the image box:
     * 0 = left/top edge, 1 = right/bottom edge.
     */
    x: number;
    y: number;

    /**
     * Hotspot size as a fraction of the image box width.
     * Typical values: 0.10–0.18
     */
    size: number;

    label: string;

    /**
     * Label position tweak in pixels relative to hotspot centre.
     * Positive dx moves right, positive dy moves down.
     */
    labelOffset: { dx: number; dy: number };
  };
};
