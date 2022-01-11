import { writable } from "svelte/store";

export let clickables = writable([]); // Clickables for cursor dot
export let isWorkScroll = writable(false); // is work slider being scrolled
export let workScrollSpeed = writable(0); // Speed of work slider

export let waitTime = 0; // Artificial page load time