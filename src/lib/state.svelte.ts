import type { SiteData, WorkData } from "./types";

export const workScrollState: { active: boolean, speed: number } = $state({ active: false, speed: 0 });
export const viewPortState: { isMobile: boolean, slickscrollInstance: any } = $state({ isMobile: false, slickscrollInstance: null })
export const scrollAnchorState: { home: HTMLElement | undefined, work: HTMLElement | undefined, about: HTMLElement | undefined } = $state({ home: undefined, work: undefined, about: undefined });
export const dataState: { siteData: SiteData | undefined, workData: WorkData | undefined } = $state({ siteData: undefined, workData: undefined })