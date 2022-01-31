
export async function asyncAnimation(delay, onLoop, condition) {
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