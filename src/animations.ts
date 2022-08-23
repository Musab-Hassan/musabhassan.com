import BezierEasing from "bezier-easing";
import anime from "animejs";



// Intro Letter reveal animation used declaratively with the 'in:' svelte directive or programatically with animejs
export function letterSlideIn (node, params: { duration?: number, delay?: number, initDelay?: number, breakWord?: boolean, promise?: Promise<any> }) {

    // Set defaults if not set
    if (!params.delay) params.delay = 35;
    if (!params.initDelay) params.initDelay = 0;
    if (!params.duration) params.duration = 600;
    if (params.breakWord === undefined) params.breakWord = true;

    // Store innerHTML of node in data attribute so it can be recovered once animation is done
    let originalNodeHTML = node.innerHTML;

    // Wrap every letter with a div and prepare it for animation
    let masks = tagLettersAndWords(node, { breakWord: params.breakWord });

    // Set initial style properties for each mask before animation begins
    masks.forEach(e => {
        e.childNodes.forEach(child => {
            child.style.transform = "translateX(150%)";
        });
        e.style.transform = "translateX(80%)";
        e.style.display = "inline-flex";
        e.style.overflow = "hidden";
    });

    // Create a node list for animejs
    let animeTargets = [];
    masks.forEach((element) => {
        animeTargets = [...animeTargets, element, ...element.childNodes];
    });

    // If animation should fire after a promise, wait for it and then start animejs animation
    if (params.promise !== undefined) {
        params.promise.then(() => {
            animeAnimation();
        })
    }

    return {
        delay: params.initDelay,
        duration: params.duration,
        // Svelte transition animation
        tick: t => {
            let eased = BezierEasing(.2, .58, .43, 1)(t); // t value with easing applied

            masks.forEach((element) => {
                // Letter animation
                element.childNodes.forEach(e => {
                    e.style.transform = `translate3d(${(150 + (-eased * 150)).toFixed(2)}%, 0px, 0px)`;  
                });
                
                // Word animation
                element.style.transform = `translate3d(${(80 + (-eased * 80)).toFixed(2)}%, 0px, 0px)`;
            });

            if (eased >= 1) {
                node.innerHTML = originalNodeHTML;
            }
        },
        // Call animation programmatically outside of svelte transitions with animejs
        anime: animeAnimation
    }



    // Call animation programmatically outside of svelte transitions with animejs
    function animeAnimation(easing?) {
        anime({
            targets: animeTargets,
            translateX: "0%",
            easing: (easing) ? easing : "cubicBezier(.2, .58, .43, 1)",
            duration: params.duration,
            delay: anime.stagger(params.delay, { start: params.initDelay }),
            // Return node to original state if destroyLettersUponSucess is true
            complete: () => {
                // Return node to original state on completion
                node.innerHTML = originalNodeHTML;
            }
        });
    }
}




// Outro Letter reveal animation used declaratively with the 'out:' svelte directive or programatically with animejs
export function letterSlideOut (node, params: { duration?: number, delay?: number, initDelay?: number, breakWord?: boolean }) {
    
    // Set defaults if not set
    if (!params.delay) params.delay = 35;
    if (!params.initDelay) params.initDelay = 0;
    if (!params.duration) params.duration = 600;
    if (params.breakWord === undefined) params.breakWord = true;

    // Store innerHTML of node in data attribute so it can be recovered once animation is done
    let originalNodeHTML = node.innerHTML;

    // Wrap every letter with a div and prepare it for animation
    let masks = tagLettersAndWords(node, { breakWord: params.breakWord });
    // Set initial style properties for each mask before animation begins
    masks.forEach(e => {
        e.style.display = "inline-flex";
        e.style.overflow = "hidden";
    });

    // Create a node list for animejs
    let animeTargets = [];
    masks.forEach((element) => {
        animeTargets = [...animeTargets, element, ...element.childNodes];
    });

    return {
        delay: params.initDelay,
        duration: params.duration,
        // Svelte transition animation
        tick: t => {
            let eased = BezierEasing(.32, .24, .76, .26)(t);

            masks.forEach((element) => {
                element.childNodes.forEach(child => {
                    child.style.transform = `translate3d(${(-150 + (eased * 150)).toFixed(2)}%, 0px, 0px)`;
                });

                element.style.transform = `translate3d(${(-80 + (eased * 80)).toFixed(2)}%, 0px, 0px)`;
            });

            if (eased >= 1) node.innerHTML = originalNodeHTML;
        },

        // Call animation outside of svelte blocks programmatically with animejs
        anime: (easing?) => {
            anime({
                targets: animeTargets,
                translateX: "-150%",
                easing: easing ? easing : "cubicBezier(.2, .58, .43, 1)",
                duration: params.duration,
                delay: anime.stagger(params.delay, { start: params.initDelay }),
                // Return node to original state if destroyLettersUponSucess is true
                complete: () => {
                    // Return node to original state on completion
                    node.innerHTML = originalNodeHTML;
                }
            })
        }
    }
}




// Intro Mask reveal animation used with the 'in:' svelte directives
export function maskSlideIn (node, params: { duration?: number, delay?: number, promise?: Promise<any>, maskStyles?: { property: string, value: string }[] }) {

    if (!params.delay) params.delay = 20;
    if (!params.duration) params.duration = 700;

    // Wrap content in an overflow hidden mask
    let mask = maskContent();

    // If animation should fire after a promise, wait for it and then start animejs animation
    if (params.promise !== undefined) {
        params.promise.then(() => {
            animeAnimation();
        })
    }

    return {
        delay: params.delay,
        duration: params.duration,
        // Svelte transition animation
        tick: t => {
            let eased = BezierEasing(.2, .58, .43, 1)(t);

            mask.style.transform = `translate3d(${(-100 + (eased * 100)).toFixed(2)}%, 0px, 0px)`;
            node.style.transform = `translate3d(${(100 + (-eased * 100)).toFixed(2)}%, 0px, 0px)`;
        },

        // Call animation outside of svelte blocks programmatically with animejs
        anime: animeAnimation
    }


    function maskContent() {
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
        node.style.transform = "translateX(-100%)";
        
        return mask;
    }

    // Call animation programmatically outside of svelte transitions with animejs
    function animeAnimation(easing?) {
        anime({
            targets: [mask, node],
            translateX: "0%",
            easing: easing ? easing : "cubicBezier(.2, .58, .43, 1)",
            duration: params.duration,
            delay: params.delay
        })
    }
}




// Outro Mask reveal animation used with the 'out:' svelte directives
export function maskSlideOut (node, params: { duration?: number, delay?: number }) {

    if (!params.delay) params.delay = 0;
    if (!params.duration) params.duration = 400;

    return {
        delay: params.delay,
        duration: params.duration,
        tick: t => {
            let eased = BezierEasing(.32, .24, .76, .26)(t);

            let isParentMask = node.parentElement?.classList.contains("a-mask");
            if (isParentMask) {
                node.parentElement.style.transform = `translate3d(${(-100 + (eased * 100)).toFixed(2)}%, 0px, 0px)`;
            }
            node.style.transform = `translate3d(${(100 + (-eased * 100)).toFixed(2)}%, 0px, 0px)`;
        }
    }
}




// Animation for workItem image when workContainer is scrolled into view
export function workImageIntro(node, params: { promise, delay?: number }) {
    if (!params.delay) params.delay = 0;

    node.style.transition = "none";
    node.style.marginRight = "30%";

    params.promise.then(() => {
        anime({
            targets: node,
            marginRight: "0%",
            easing: "easeOutQuint",
            duration: 1600,
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










// Wrap each word with a mask and return masks
function tagLettersAndWords(node, params: { breakWord: boolean }) {

    let masks = node.querySelectorAll(".a-text-mask");

    if (masks.length < 1) {
        node.innerHTML = parseLetters(node.innerHTML, "<div class=\"a-text-mask\"><div class=\"a-text-block\">", "</div></div>");
        masks = node.querySelectorAll(".a-text-mask");
    }

    if (params.breakWord) {
        let words = node.querySelectorAll(".a-word");
        words.forEach((element, i) => {
            element.style.display = "inline-block";
            element.style.whiteSpace = "nowrap";
        });

        // Set letter-spacing to exact computed letter-spacing to prevent animation popping
        let computed = getComputedStyle(node);
        let computedLetterSpacing = computed.getPropertyValue("letter-spacing");

        let letters = node.querySelectorAll(".a-text-block");
        letters.forEach(element => {
            element.style.letterSpacing = computedLetterSpacing;
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