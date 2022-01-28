
import BezierEasing from "bezier-easing";

// If client is a phone - It's unreliable but I dont have a better solution
export function isUnsupportedClient(): boolean {
    let agent = navigator.userAgent || navigator.vendor;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(agent.substring(0, 4))) {
        return true;
    }
    return false;
}


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
                if (e === " " || string[i-1] === " " || i === 0 || i === string.length) {
                    isWord = !isWord;
                    newString += isWord ? "<div class=\"a-word\">" : "</div>";
                }
                if (e == "<") isTag = true;
                if (string[i-1] == ">") isTag = false;

                if (!isTag && e !== " ") newString += startWord + e + endWord;
            });

            return newString;
        }
    }
}


// Mask reveal animation used with the 'in:' and 'out:' svelte directives
export function maskSlide() {
    return {
        in: (node, params: { duration?: number, delay?: number}) => {

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



async function asyncAnimation(delay, onLoop, condition) {
    let target = Date.now() + delay;

    await new Promise((resolve) => {
        function loop() {
            if (Date.now() >= target) {
                resolve(true);
                return;
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    let loop = () => {
        if (condition()) return;
        onLoop();
        requestAnimationFrame(loop);
    }
    loop();
}