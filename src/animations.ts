import BezierEasing from "bezier-easing";
import { asyncAnimation } from "./utils";
import anime from "animejs";

// Letter reveal animation used with the 'in:' and 'out:' svelte directives
export function letterSlide() {
    return {
        in: (node, params: { duration?: number, delay?: number, initDelay?: number, breakWord?: boolean, useAnime?: boolean }) => {

            if (!params.delay) params.delay = 35;
            if (!params.initDelay) params.initDelay = 0;
            if (!params.duration) params.duration = 600;
            if (params.breakWord === undefined) params.breakWord = true;
            if (params.useAnime === undefined) params.useAnime = false;

            let masks = wordWrapHandler(node, params.breakWord);

            // Set default properties
            masks.forEach(e => {
                e.childNodes.forEach(child => {
                    child.style.transform = "translateX(150%)";
                });
                e.style.transform = "translateX(80%)";
                e.style.display = "inline-flex";
                e.style.overflow = "hidden";
            });

            let eased = 0, animeTargets = []; // t value with easing applied

            masks.forEach((element) => {
                let index = Array.from(element.parentNode.children).indexOf(element) + 1;
                
                if (params.useAnime) { // Register children for use with anime
                    animeTargets = [...animeTargets, element, ...element.childNodes];
                } else {
                    // Async animations for better performance in svetle tick only
                    element.childNodes.forEach(e => {
                        asyncAnimation((params.delay * index), () => {
                            e.style.transform = `translateX(${(150 + (-eased * 150)).toFixed(2)}%)`;
                        }, () => eased >= 1);
                    });

                    asyncAnimation((params.delay * index), () => {
                        element.style.transform = `translateX(${(80 + (-eased * 80)).toFixed(2)}%)`;
                    }, () => eased >= 1);
                }
            });

            return {
                delay: params.initDelay,
                duration: params.duration,
                tick: t => { // Svelte transitions
                    eased = BezierEasing(.2, .58, .43, 1)(t); // t value with easing applied
                },
                anime: (easing?) => { // Call animation outside of svelte blocks programmatically with animejs
                    if (!params.useAnime) return;
                    anime({
                        targets: animeTargets,
                        translateX: "0%",
                        easing: easing ? easing : "cubicBezier(.2, .58, .43, 1)",
                        duration: params.duration,
                        delay: anime.stagger(params.delay, {start: params.initDelay})
                    })
                }
            }
        },

        out: (node, params: { duration?: number, delay?: number, initDelay?: number, extraElems?: any }) => {

            let masks = node.querySelectorAll(".a-text-mask");

            if (!params.delay) params.delay = 25;
            if (!params.initDelay) params.initDelay = 0;

            return {
                delay: params.initDelay,
                duration: 600,
                tick: t => {
                    // let eased = BezierEasing(.59, .11, .07, 1.07)(t);
                    let eased = BezierEasing(.32, .24, .76, .26)(t);

                    masks.forEach((e) => {
                        e.childNodes.forEach(i => {
                            i.style.transform = `translateX(${(-150 + (eased * 150)).toFixed(2)}%)`;
                        });

                        e.style.transform = `translateX(${(-80 + (eased * 80)).toFixed(2)}%)`;
                    });
                }
            }
        }
    }

    // Wrap each word with a mask and return masks
    function wordWrapHandler(node, breakWord: boolean) {

        let masks = node.querySelectorAll(".a-text-mask");

        if (masks.length < 1) {
            node.innerHTML = parseLetters(node.innerHTML, "<div class=\"a-text-mask\"><div class=\"a-text-block\">", "</div></div>");
            masks = node.querySelectorAll(".a-text-mask");
        }

        if (breakWord) {
            let words = node.querySelectorAll(".a-word");
            words.forEach(element => {
                element.style.display = "inline-block";
                element.style.marginRight = "0.45vw"
                element.style.whiteSpace = "nowrap"
            });
        }

        return masks;

        // parse the letters and break apart words
        function parseLetters(string: string, startWord: string, endWord: string) {
            let newString = "";
            let isTag = false;
            let isWord = false;

            [...string].forEach((e, i) => {
                // Tag beginning detection
                if (e === "<") { 
                    isTag = true; 
                    if (isWord) { isWord = false; newString += "</div>"; }
                }
                // Tag end detection
                if (string[i - 1] == ">" && e !== "<") {
                    isTag = false;
                    if (!isWord) { isWord = true; newString += "<div class=\"a-word\">"; }
                }

                if (isTag) {
                    // Pass characters belong to tags directly without modifying them
                    newString += e;
                } else {
                    // Detect Words and wrap them with tags
                    if (e === " " || string[i - 1] === " " || i === 0 || i === string.length) {
                        isWord = !isWord;
                        newString += isWord ? "<div class=\"a-word\">" : "</div>";
                    }
                    // Add mask to letter and Ignore spaces
                    if (e !== " ") newString += startWord + e + endWord;
                }
            });

            return newString;
        }
    }
}


// Mask reveal animation used with the 'in:' and 'out:' svelte directives
export function maskSlide() {
    return {
        in: (node, params: { duration?: number, delay?: number, maskStyles?: { property: string, value: string }[] }) => {

            if (!params.delay) params.delay = 20;
            if (!params.duration) params.duration = 700;

            let mask = addMask();

            return {
                delay: params.delay,
                duration: params.duration,
                tick: t => {
                    let eased = BezierEasing(.2, .58, .43, 1)(t);

                    mask.style.transform = `translateX(${(100 + (-eased * 100)).toFixed(2)}%)`;
                    node.style.transform = `translateX(${(-100 + (eased * 100)).toFixed(2)}%)`;
                },
                anime: (easing?) => {
                    anime({
                        targets: [mask, node],
                        translateX: "0%",
                        easing: easing ? easing : "cubicBezier(.2, .58, .43, 1)",
                        duration: params.duration,
                        delay: params.delay
                    })
                }
            }

            function addMask() {
                let mask = document.createElement("div");
                let parent = node.parentNode;
                let index = Array.from(parent.children).indexOf(node);

                mask.classList.add("a-mask");
                node.classList.add("a-content");
                mask.insertBefore(node, mask.children[0]);
                mask.style.display = "inline-block";
                mask.style.overflow = "hidden";
                if (params.maskStyles) {
                    params.maskStyles.forEach(element => {
                        mask.style[element.property] = element.value;
                    });
                }

                parent.insertBefore(mask, parent.children[index]);

                mask.style.transform = "translateX(100%)";
                node.style.transform = "translateX(-100%)"
                return mask;
            }
        },

        out: (node, params: { duration?: number, delay?: number }) => {

            if (!params.delay) params.delay = 0;
            if (!params.duration) params.duration = 400;

            return {
                delay: params.delay,
                duration: params.duration,
                tick: t => {
                    let eased = BezierEasing(.32, .24, .76, .26)(t);

                    node.style.transform = `translateX(${(-100 + (eased * 100)).toFixed(2)}%)`;
                }
            }
        }
    }
}

// Animation for workItem image when workContainer is scrolled into view
export function workImageIntro(node, params: { promise, delay?: number }) {
    if (!params.delay) params.delay = 0;

    node.style.transition = "none";
    node.style.marginRight = "50%"

    params.promise.then(() => {
        anime({
            targets: node,
            marginRight: "0%",
            easing: "easeOutQuint",
            duration: 2000,
            delay: params.delay,
            complete: () => {
                node.style.marginRight = null;
                node.style.transition = null;
            }
        });
    });
}

// Animation for workItem image when workContainer is scrolled into view
export function workListIntro(node, params: { promise, delay?: number }) {
    if (!params.delay) params.delay = 0;

    node.style.transition = "none";
    node.style.transform = "translateX(100%)"

    params.promise.then(() => {
        anime({
            targets: node,
            translateX: "0%",
            easing: "easeOutQuint",
            duration: 1500,
            delay: params.delay,
            complete: () => {
                node.style.transform = null;
                node.style.transition = null;
            }
        });
    });
}

// Opacity animation for workItem texts and links when workContainer is scrolled into view
export function workSubItemsIntro(node, params: { promise, delay?: number }) {
    if (!params.delay) params.delay = 0;

    node.style.transform = "translateX(50%)";
    node.style.opacity = "0"

    params.promise.then(() => {
        anime({
            targets: node,
            translateX: "0%",
            opacity: "1",
            easing: "easeInOutQuint",
            duration: 1300,
            delay: params.delay + 100,
            complete: () => {
                node.style.opacity = null;
                node.style.transform = null;
            }
        });
    });
}