// waitForElementTransition by markcellus
// https://github.com/markcellus/wait-for-element-transition

// Downloaded version of to resolve issue with dead repository

interface CssPropUnitMap {
    num?: number;
    unit: string;
}

/**
 * Takes a value and separates the number and unit into a key/value map.
 */
const getCssPropUnitMap = (v: string): CssPropUnitMap => {
    v = v.trim();
    const numParts = v.match('[0-9.]+');
    let unit = 'ms';
    let num;
    const numString: string = numParts ? numParts[0] : '';
    if (numString) {
        unit = v.split(numString)[1];
        num = Number(numString);
    }
    return {
        num,
        unit,
    };
};

/**
 * Converts a css timing unit value into milliseconds.
 */
const convertCssTimeValueToMilliseconds = (val: string): string => {
    const map = getCssPropUnitMap(val);
    const num = map ? map.num : undefined;
    if (!num) {
        return '';
    }
    const unit = val.replace(num + '', '');
    let value = num;
    if (unit === 's') {
        value = num * 1000;
    }
    return value + 'ms';
};

/**
 * Gets the time is takes for the element to transition to its show state.
 */
function getTransitionDuration(el: HTMLElement): number {
    /**
     * Takes a css property name and returns the javascript version of it.
     */
    const getJsPropName = (cssProp: string): keyof CSSStyleDeclaration => {
        // convert to camelCase
        return cssProp.replace(/-([a-z])/g, (letter) => {
            return letter[1].toUpperCase();
        }) as keyof CSSStyleDeclaration;
    };

    /**
     * Gets the computed property of the element.
     */
    const getCssComputedProperty = (prop: string): string => {
        const style = window.getComputedStyle(el);
        return (
            style.getPropertyValue(prop) ||
            (el.style[getJsPropName(prop)] as string)
        );
    };

    const delayProp = getCssComputedProperty('transition-delay') || '0ms';
    const durationProp = getCssComputedProperty('transition-duration') || '0ms';
    const times = Array.isArray(durationProp) ? durationProp : [durationProp];
    const delay = Array.isArray(delayProp) ? delayProp : [delayProp];
    let highest = 0;
    let map;

    times.push.apply(times, delay); // account for delay

    // calculate highest number of time
    times.forEach((value) => {
        value.split(',').forEach((v: string) => {
            v = convertCssTimeValueToMilliseconds(v);
            map = getCssPropUnitMap(v);
            if (map.num && map.num > highest) {
                highest = map.num;
            }
        });
    });

    return highest;
}

/**
 * Builds a transition promise that waits to resolve until the module el's CSS transition is completed (if applicable).
 */
export function waitForElementTransition(
    el: HTMLElement
): Promise<HTMLElement> {
    const duration = getTransitionDuration(el);
    return new Promise((resolve) => {
        if (duration > 0) {
            setTimeout(() => {
                resolve(el);
            }, duration);
        } else {
            resolve(el);
        }
    });
}