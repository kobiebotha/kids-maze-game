document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea') as HTMLElement;

    const sound = new Audio('sounds/pop2.wav'); // path to your .wav file


    const maxCircles = 5;
    interface Circle {
        x: number;
        y: number;
        radius: number;
        elem?: HTMLElement;
    }
    
    let circles: Circle[] = [];

    function circlesOverlap(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }

    function createCircle() {
        let overlap;
        let newCircle;
        do {
            overlap = false;
            const radius = Math.random() * 50 + 25; // random radius between 25 and 75
            const x = Math.random() * (window.innerWidth - radius * 2) + radius;
            const y = Math.random() * (window.innerHeight - radius * 2) + radius;

            newCircle = { x, y, radius };

            // Check if new circle overlaps with existing circles
            for (let circle of circles) {
                if (circlesOverlap(circle, newCircle)) {
                    overlap = true;
                    break;
                }
            }
        } while (overlap);

        const circleElem = document.createElement('div');
        circleElem.classList.add('circle');
        circleElem.style.width = circleElem.style.height = `${newCircle.radius * 2}px`;
        circleElem.style.left = `${newCircle.x - newCircle.radius}px`;
        circleElem.style.top = `${newCircle.y - newCircle.radius}px`;

        circleElem.addEventListener('mouseover', () => {
            sound.play();
            circleElem.remove();
            circles = circles.filter(c => c.elem !== circleElem);
            createCircle();
        });

        gameArea.appendChild(circleElem);
        circles.push({ ...newCircle, elem: circleElem });
    }

    for (let i = 0; i < maxCircles; i++) {
        createCircle();
    }
});
