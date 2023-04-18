import { writable } from "svelte/store";

let fetchJsonData = (sourceFile: string) => new Promise(async (resolve: (data: any[]) => void) => {
    let data = await (await fetch(sourceFile)).json();
    resolve(data);
});

export let slickScrollInstance = writable(null); // Instance of slickscroll

export let isWorkScroll = writable(false); // Is work slider being scrolled
export let workScrollSpeed = writable(0); // Speed of work slider for use with Threejs effects

export let isMobile = writable(false); // Is client a phone

// Navigation anchors
export let homeAnchor = writable(null);
export let workAnchor = writable(null);
export let aboutAnchor = writable(null);

export let imgPromises = writable([]); // Array of asynchronous image promises
export let loadPageResolve;
export let loadPagePromise = new Promise((resolve) => loadPageResolve = resolve);
export let loaderAnimationResolve;
export let loaderAnimationPromise = new Promise((resolve) => loaderAnimationResolve = resolve);


// Fetch work data from the work-data.json file
export const workItemsFetch = fetchJsonData("work-data.json");
// Fetch other data from the data.json file
export const dataFetch = fetchJsonData("data.json");