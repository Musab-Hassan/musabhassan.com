import { writable } from "svelte/store";

export let clickables = writable([]); // Clickables for cursor dot
export let isWorkScroll = writable(false); // is work slider being scrolled
export let workScrollSpeed = writable(0); // Speed of work slider

export let waitTime = 50; // Artificial page load time
export let isMobile = writable(false);

export let homePosition = writable(0);
export let workPosition = writable(0);
export let aboutPosition = writable(0);