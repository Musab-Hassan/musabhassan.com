import { writable, type Writable } from "svelte/store";

export let imgPromises: Writable<Promise<string>[]>= writable([]); // Array of asynchronous image promises
export let loadPageResolve: (value?: any) => void;
export let loadPagePromise = new Promise((resolve) => loadPageResolve = resolve);
export let loaderAnimationResolve: (value?: any) => void;
export let loaderAnimationPromise = new Promise((resolve) => loaderAnimationResolve = resolve);