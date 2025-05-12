import BezierEasing from "bezier-easing";
import { animate, stagger } from "animejs";
import { workScrollState } from "$lib/state.svelte";
import { quintOut } from "svelte/easing";

// Intro Letter reveal animation used declaratively with the 'in:' svelte directive or programmatically with anime.js
export function letterSlideIn (node: HTMLElement, params?: { duration?: number, delay?: number, initDelay?: number, breakWord?: boolean, promise?: Promise<any> }) {

    // Set defaults if not set
    params = (params === undefined) ? {} : params;
    if (!params.delay) params.delay = 35;
    if (!params.initDelay) params.initDelay = 0;
    if (!params.duration) params.duration = 600;
    if (params.breakWord === undefined) params.breakWord = true;

    // Store innerHTML of node in data attribute so it can be recovered once animation is done
    let originalNodeHTML = node.innerHTML;

    // Wrap every letter with a div and prepare it for animation
    let masks = tagLettersAndWords(node, { breakWord: params.breakWord });

    // Set initial style properties for each mask before animation begins
    masks.forEach((e: HTMLElement) => {
        e.childNodes.forEach(child => {
            (child as HTMLElement).style.transform = "translateX(150%)";
        });
        e.style.transform = "translateX(80%)";
        e.style.display = "inline-flex";
        e.style.overflowY = "visible";
        e.style.overflowX = "clip";
    });

    // Create a node list for anime.js
    let animeTargets: HTMLElement[] = [];
    masks.forEach((element: HTMLElement) => {
        const children = element.childNodes as NodeListOf<HTMLElement>;
        animeTargets = [...animeTargets, element, ...children];
    });

    // If animation should fire after a promise, wait for it and then start anime.js animation
    if (params.promise !== undefined) {
        params.promise.then(() => {
            animeAnimation();
        })
    }

    return {
        delay: params.initDelay,
        duration: params.duration,
        // Svelte transition animation
        tick: (t: number) => {
            let eased = BezierEasing(.2, .58, .43, 1)(t); // t value with easing applied

            masks.forEach((element: HTMLElement) => {
                // Letter animation
                element.childNodes.forEach(e => {
                    (e as HTMLElement).style.transform = `translate3d(${(150 + (-eased * 150)).toFixed(2)}%, 0px, 0px)`;  
                });
                
                // Word animation
                element.style.transform = `translate3d(${(80 + (-eased * 80)).toFixed(2)}%, 0px, 0px)`;
            });

            if (eased >= 1) {
                node.innerHTML = originalNodeHTML;
            }
        },
        // Call animation programmatically outside of svelte transitions with anime.js
        anime: animeAnimation
    }



    // Call animation programmatically outside of svelte transitions with anime.js
    function animeAnimation(animeParams?: { easing?: string, onComplete?: () => void }) {
        console.log("Fired", animeTargets, params);
        if (animeParams === undefined) animeParams = {};
        animate(animeTargets, {
            translateX: "0%",
            // duration: params!.duration,
            easing: (animeParams.easing) ? animeParams.easing : "cubicBezier(.2, .58, .43, 1)",
            delay: stagger(params!.delay!, { start: params!.initDelay }),
            // Return node to original state if destroyLettersUponSuccess is true
            onComplete: () => {
                // Return node to original state on completion
                node.innerHTML = originalNodeHTML;
                if (animeParams)
                    if (animeParams.onComplete) 
                        animeParams.onComplete();
            }
        });
    }
}




// Outro Letter reveal animation used declaratively with the 'out:' svelte directive or programmatically with anime.js
export function letterSlideOut (node: HTMLElement, params?: { duration?: number, delay?: number, initDelay?: number, breakWord?: boolean }) {
    
    // Set defaults if not set
    params = (params === undefined) ? {} : params;
    if (!params.delay) params.delay = 35;
    if (!params.initDelay) params.initDelay = 0;
    if (!params.duration) params.duration = 600;
    if (params.breakWord === undefined) params.breakWord = true;

    // Store innerHTML of node in data attribute so it can be recovered once animation is done
    let originalNodeHTML = node.innerHTML;

    // Wrap every letter with a div and prepare it for animation
    let masks = tagLettersAndWords(node, { breakWord: params.breakWord });
    // Set initial style properties for each mask before animation begins
    masks.forEach((e: HTMLElement) => {
        e.style.display = "inline-flex";
        e.style.overflow = "hidden";
    });

    // Create a node list for anime.js
    let animeTargets: HTMLElement[] = [];
    masks.forEach((element: HTMLElement) => {
        const children = element.childNodes as NodeListOf<HTMLElement>;
        animeTargets = [...animeTargets, element, ...children];
    });

    return {
        delay: params.initDelay,
        duration: params.duration,
        // Svelte transition animation
        tick: (t: number) => {
            let eased = BezierEasing(.32, .24, .76, .26)(t);

            masks.forEach((element: HTMLElement) => {
                element.childNodes.forEach(child => {
                    (child as HTMLElement).style.transform = `translate3d(${(-150 + (eased * 150)).toFixed(2)}%, 0px, 0px)`;
                });

                element.style.transform = `translate3d(${(-80 + (eased * 80)).toFixed(2)}%, 0px, 0px)`;
            });

            if (eased >= 1) node.innerHTML = originalNodeHTML;
        },

        // Call animation outside of svelte blocks programmatically with anime.js
        anime: (easing?: string) => {
            animate(animeTargets, {
                translateX: "-150%",
                easing: easing ? easing : "cubicBezier(.2, .58, .43, 1)",
                // duration: params!.duration,
                delay: stagger(params!.delay!, { start: params!.initDelay }),
                // Return node to original state if destroyLettersUponSuccess is true
                onComplete: () => {
                    // Return node to original state on completion
                    node.innerHTML = originalNodeHTML;
                }
            })
        }
    }
}




// Intro Mask reveal animation used with the 'in:' svelte directives
export function maskSlideIn(node: HTMLElement, params?: { duration?: number, delay?: number, reverse?: boolean, promise?: Promise<any>, maskStyles?: { property: string, value: string }[] }) {

    params = (params === undefined) ? {} : params;
    if (!params.delay) params.delay = 20;
    if (!params.duration) params.duration = 700;
    if (!params.reverse) params.reverse = false;

    // Wrap content in an overflow hidden mask
    let mask = maskContent();

    // If animation should fire after a promise, wait for it and then start anime.js animation
    if (params.promise !== undefined) {
        params.promise.then(() => {
            animeAnimation();
        })
    }

    return {
        delay: params.delay,
        duration: params.duration,
        // Svelte transition animation
        tick: (t: number) => {
            
            // let eased = BezierEasing(.2, .58, .43, 1)(t);
            let eased = BezierEasing(.58, .14, .06, .97)(t);

            if (params!.reverse) {
                mask.style.transform = `translate3d(${(100 + (-eased * 100)).toFixed(2)}%, 0px, 0px)`;
                node.style.transform = `translate3d(${(-100 + (eased * 100)).toFixed(2)}%, 0px, 0px)`;
            } else {
                mask.style.transform = `translate3d(${(-100 + (eased * 100)).toFixed(2)}%, 0px, 0px)`;
                node.style.transform = `translate3d(${(100 + (-eased * 100)).toFixed(2)}%, 0px, 0px)`;
            }
        },

        // Call animation outside of svelte blocks programmatically with anime.js
        anime: animeAnimation
    }


    function maskContent() {
        let mask = document.createElement("div");
        let parent = node.parentNode!;
        let index = Array.from(parent!.children).indexOf(node);

        params = (params === undefined) ? {} : params;

        mask.classList.add("a-mask");
        node.classList.add("a-content");
        mask.insertBefore(node, mask.children[0]);
        mask.style.display = "inline-block";
        mask.style.overflow = "hidden";
        if (params.maskStyles) {
            params.maskStyles.forEach(element => {
                (mask.style as any)[element.property] = element.value;
            });
        }

        parent.insertBefore(mask, parent.children[index]);

        if (params.reverse) {
            mask.style.transform = "translateX(-100%)";
            node.style.transform = "translateX(100%)";
        } else {
            mask.style.transform = "translateX(100%)";
            node.style.transform = "translateX(-100%)";
        }
        
        return mask;
    }

    // Call animation programmatically outside of svelte transitions with anime.js
    function animeAnimation(easing?: string) {
        animate([mask, node], {
            translateX: "0%",
            easing: easing ? easing : "cubicBezier(.58,.14,.06,.97)",
            // duration: params!.duration,
            // delay: params!.delay
        })
    }
}




// Outro Mask reveal animation used with the 'out:' svelte directives
export function maskSlideOut (node: HTMLElement, params?: { duration?: number, delay?: number }) {

    params = (params === undefined) ? {} : params;
    if (!params.delay) params.delay = 0;
    if (!params.duration) params.duration = 400;

    return {
        delay: params.delay,
        duration: params.duration,
        tick: (t: number) => {
            let eased = BezierEasing(.32, .24, .76, .26)(t);

            let isParentMask = node.parentElement?.classList.contains("a-mask");
            if (isParentMask) {
                node.parentElement!.style.transform = `translate3d(${(-100 + (eased * 100)).toFixed(2)}%, 0px, 0px)`;
            }
            node.style.transform = `translate3d(${(100 + (-eased * 100)).toFixed(2)}%, 0px, 0px)`;
        }
    }
}




// Animation for workItem image when workContainer is scrolled into view
export function workImageIntro(node: HTMLElement, params?: { promise: Promise<any>, delay?: number }) {

    if (params === undefined) return;

    if (!params.delay) params.delay = 0;

    node.style.transition = "none";
    node.style.marginRight = "60%";

    params.promise.then(() => {
        animate(node, {
            marginRight: "0%",
            easing: "outQuint",
            duration: 1400,
            // delay: params.delay,
            onComplete: () => {
                node.style.marginRight = "";
                node.style.transition = "";
            }
        });
    });
}




// Animation for workItem image when workContainer is scrolled into view
export function workListIntro(node: HTMLElement, params?: { promise: Promise<any>, delay?: number, onComplete?: () => void }) {
    
    if (params === undefined) return;

    if (!params.delay) params.delay = 0;

    node.style.transition = "none";
    node.style.transform = "translateX(100%)"

    params.promise.then(() => {
        animate(node, {
            translateX: "0%",
            easing: "outQuint",
            duration: 1600,
            // delay: params.delay,
            onUpdate: (anim: { progress: number; }) => {
                const t = 1 - quintOut(anim.progress / 100);
                workScrollState.speed = t * 2500;
            },
            onComplete: () => {
                node.style.transform = "";
                node.style.transition = "";
                if (params.onComplete) params.onComplete();
            }
        });
    });
}










// Wrap each word with a mask and return masks
function tagLettersAndWords(node: HTMLElement, params: { breakWord: boolean }) {

    let masks = node.querySelectorAll(".a-text-mask");

    if (masks.length < 1) {
        node.innerHTML = parseLetters(node.innerHTML, "<div class=\"a-text-mask\"><div class=\"a-text-block\">", "</div></div>");
        masks = node.querySelectorAll(".a-text-mask");
    }

    if (params.breakWord) {
        let words = node.querySelectorAll(".a-word");
        (words as NodeListOf<HTMLElement>).forEach(element => {
            element.style.display = "inline-block";
            element.style.whiteSpace = "nowrap";
        });
    } else {
        let masks = node.querySelectorAll(".a-text-mask");
        (masks as NodeListOf<HTMLElement>).forEach(element => {
            element.style.whiteSpace = "no-wrap";
        })
    }

    return masks as NodeListOf<HTMLElement>;

    // parse the letters and break apart words
    function parseLetters(string: string, startWord: string, endWord: string) {
        let newString = "";
        let isTag = false;
        let isWord = false;

        [...string].forEach((e, i) => {
            // Tag beginning detection
            if (e === "<") {
                isTag = true;
                if (isWord) { 
                    isWord = false;
                    newString += "</div>"; 
                }
            }
            // Tag end detection
            if (string[i - 1] == ">" && e !== "<") {
                isTag = false;
                if (!isWord) { 
                    isWord = true; 
                    newString += "<div class=\"a-word\">"; 
                }
            }

            if (isTag) {
                // Pass characters belong to tags directly without modifying them
                newString += e;
            } else {
                // Detect Words and wrap them with word tags and spacers
                if (e === " " || string[i - 1] === " " || i === 0 || i === string.length) {
                    isWord = !isWord;
                    newString += isWord ? "<div class=\"a-word\">" : "</div><span class=\"a-spacer a-text-block\"> </span>";
                }
                // Add mask to letter and Ignore spaces
                if (e !== " ") newString += startWord + e + endWord;
            }
        });

        return newString;
    }
}