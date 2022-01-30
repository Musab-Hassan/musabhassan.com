import BezierEasing from "bezier-easing";
import { asyncAnimation } from "./utils";
import anime from "animejs";

// Letter reveal animation used with the 'in:' and 'out:' svelte directives
export function letterSlide() {
    return {
        in: (node, params: { duration?: number, delay?: number, initDelay?: number, breakWord?: boolean }) => {

            if (!params.delay) params.delay = 35;
            if (!params.initDelay) params.initDelay = 0;
            if (!params.duration) params.duration = 600;
            if (params.breakWord === undefined) params.breakWord = true;

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

            let eased = 0; // t value with easing applied

            // Async animations for better performance
            masks.forEach((e, i) => {
                let index = Array.from(e.parentNode.children).indexOf(e) + 1;

                e.childNodes.forEach(i => {
                    asyncAnimation((params.delay * index), () => {
                        i.style.transform = `translateX(${(150 + (-eased * 150)).toFixed(2)}%)`;
                    }, () => eased >= 1);
                });

                asyncAnimation((params.delay * index), () => {
                    e.style.transform = `translateX(${(80 + (-eased * 80)).toFixed(2)}%)`;
                }, () => eased >= 1);
            });

            return {
                delay: params.initDelay,
                duration: params.duration,
                tick: t => {
                    eased = BezierEasing(.2, .58, .43, 1)(t); // t value with easing applied
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
                element.style.marginRight = "0.4vw"
            });
        }

        return masks;

        // parse the letters and break apart words
        function parseLetters(string: string, startWord: string, endWord: string) {
            let newString = "";
            let isTag = false;
            let isWord = false;

            [...string].forEach((e, i) => {
                if (e === " " || string[i - 1] === " " || i === 0 || i === string.length) {
                    isWord = !isWord;
                    newString += isWord ? "<div class=\"a-word\">" : "</div>";
                }
                if (e == "<") isTag = true;
                if (string[i - 1] == ">") isTag = false;

                if (!isTag && e !== " ") newString += startWord + e + endWord;
            });

            return newString;
        }
    }
}


// Mask reveal animation used with the 'in:' and 'out:' svelte directives
export function maskSlide() {
    return {
        in: (node, params: { duration?: number, delay?: number }) => {

            if (!params.delay) params.delay = 20;
            if (!params.duration) params.duration = 700;

            addMask();

            return {
                delay: params.delay,
                duration: params.duration,
                tick: t => {
                    let eased = BezierEasing(.2, .58, .43, 1)(t);

                    node.style.transform = `translateX(${(100 + (-eased * 100)).toFixed(2)}%)`;
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
                parent.insertBefore(mask, parent.children[index]);

                node.style.transform = "translateX(100%)";
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

// Animation for workItems when workContainer is scrolled into view
export function workItemIntro(node, params: { promise, delay?: number }) {
    if (!params.delay) params.delay = 0;

    node.style.height = "0vh";
    node.style.opacity = "0"
    node.style.transition = "none"

    params.promise.then(() => {
        anime({
            targets: node,
            height: "60vh",
            opacity: "1",
            easing: "cubicBezier(.24,.25,.12,1.01)",
            duration: 1000,
            delay: params.delay,
            complete: () => {
                node.style.opacity = null;
                node.style.height = null;
                node.style.transition = null
            }
        });
    });
}

// Run svelte transitions, declared above, programmatically 
export function animationClock(animateFunc: (t) => void, duration: number, reverse: boolean = false) {
    let start;

    function step(timestamp) {
        if (start === undefined) start = timestamp;
        const elapsed = timestamp - start;

        let t = elapsed / duration;
        t = reverse ? 1 - t : t;

        if (t > 1 || t < 0) t = Math.abs(Math.round(t));

        animateFunc(Math.round(t * 1000) / 1000);

        if (elapsed < duration) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
}
