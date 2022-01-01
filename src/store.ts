import { writable } from "svelte/store";

// Clickables for cursor dot
export let clickables = writable([]);
export let isWorkScroll = writable(false);

// Artificial page load time
export let waitTime = 1000;