export const FLEX_SPACING = ["none", "xxs", "xs", "s", "m", "l", "xl"] as const;
export type FlexSpacing = (typeof FLEX_SPACING)[number];
