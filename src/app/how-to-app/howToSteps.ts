export interface HowToStepData {
  id: number;
  title: string;
  description: string;
  image: string;
  /**
   * Highlight position
   * These are PERCENTAGES of the image container.
   * Adjust these numbers to perfectly align the ring.
   */
  focus: {
    x: number;
    y: number;
    size: number;
  };
}

export const HOW_TO_STEPS: HowToStepData[] = [
  {
    id: 1,
    title: "Open Safari",
    description:
      "Open Safari and go to www.james-square.com, then tap the three dots in the bottom-right corner.",
    image: "/images/brands/step1-removebg-preview.png",
    focus: {
      x: 88,
      y: 90,
      size: 48,
    },
  },
  {
    id: 2,
    title: "Tap Share",
    description: "From the menu, tap Share to open the iOS sharing options.",
    image: "/images/brands/step2-removebg-preview.png",
    focus: {
      x: 50,
      y: 52,
      size: 54,
    },
  },
  {
    id: 3,
    title: "Add to Home Screen",
    description: "Scroll down and tap Add to Home Screen.",
    image: "/images/brands/step3-removebg-preview.png",
    focus: {
      x: 50,
      y: 84,
      size: 56,
    },
  },
  {
    id: 4,
    title: "Confirm details",
    description: "Make sure Open as Web App is enabled, then tap Add.",
    image: "/images/brands/step4-removebg-preview.png",
    focus: {
      x: 82,
      y: 10,
      size: 52,
    },
  },
  {
    id: 5,
    title: "Launch James Square",
    description:
      "James Square will now appear on your home screen. Tap it to open like an app.",
    image: "/images/brands/step5-removebg-preview.png",
    focus: {
      x: 63,
      y: 58,
      size: 64,
    },
  },
];
