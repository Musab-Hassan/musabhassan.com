import { writable } from "svelte/store";

// Clickables for cursor dot
export let clickables = writable([]);
export let isWorkScroll = writable(false);