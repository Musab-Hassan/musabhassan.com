import { writable } from "svelte/store";

export let clickables = writable([]); // Clickables for cursor dot
export let isWorkScroll = writable(false); // is work slider being scrolled
export let workScrollSpeed = writable(0); // Speed of work slider

export let waitTime = 50; // Artificial page load time
export let isMobile = writable(false);

export let homeAnchor = writable(null);
export let workAnchor = writable(null);
export let aboutAnchor = writable(null);