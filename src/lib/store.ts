import { writable, type Writable } from "svelte/store";
import type { SiteData, WorkData } from "$lib/types";

export let slickScrollInstance: Writable<any> = writable(); // Instance of slickscroll

export let isWorkScroll: Writable<boolean> = writable(false); // Is work slider being scrolled
export let workScrollSpeed: Writable<number> = writable(0); // Speed of work slider for use with Three effects

export let isMobile = writable(false); // Is client a phone

// Navigation anchors
export let homeAnchor: Writable<HTMLElement> = writable();
export let workAnchor: Writable<HTMLElement> = writable();
export let aboutAnchor: Writable<HTMLElement> = writable();

export let imgPromises: Writable<Promise<string>[]>= writable([]); // Array of asynchronous image promises
export let loadPageResolve: (value?: any) => void;
export let loadPagePromise = new Promise((resolve) => loadPageResolve = resolve);
export let loaderAnimationResolve: (value?: any) => void;
export let loaderAnimationPromise = new Promise((resolve) => loaderAnimationResolve = resolve);


// Fetch work data from the work-data.json file
export const workItemsFetch: Writable<WorkData> = writable();
// Fetch other data from the data.json file
export const siteDataFetch: Writable<SiteData> = writable();