document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea') as HTMLElement;
    const startButton = document.getElementById('startButton') as HTMLButtonElement;

    const sound = new Audio('sounds/sophiapop.wav'); // path to your .wav file
    const soundFiles = ['sounds/sophiapop.wav', 'sounds/click.wav', 'sounds/pop2.wav'];
    const lightningSound = new Audio('sounds/bolt.wav'); // Replace with your sound file path

    const maxCircles = 28;
    const rainbowColors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    let currentColorIndex = 0;
    interface Circle {
        x: number;
        y: number;
        radius: number;
        color: string;
        elem?: HTMLElement;
    }

    let circles: Circle[] = [];

    gameArea.style.display = 'none';
    startButton.addEventListener('click', function() {
        // Hide the start button
        startButton.style.display = 'none';

        // Show the game area
        gameArea.style.display = 'block';

        document.body.style.cursor = "url('images/girlcursor.png'), auto";
        createAllCircles();
    });

    function createAllCircles() {
        for (let i = 0; i < maxCircles; i++) {
            createCircle(rainbowColors[Math.floor(i / 4)]);
        }
    }

    function circlesOverlap(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }

    function createLightningBolt() {
        const bolt = document.createElement('img');
        bolt.src = 'images/bolt.png'; // Replace with your lightning bolt image path
        bolt.classList.add('lightning');

        let x, y, overlap;
        do {
            overlap = false;
            x = Math.random() * (window.innerWidth - bolt.offsetWidth);
            y = Math.random() * (window.innerHeight - bolt.offsetHeight);
    
            // Check if new bolt overlaps with existing circles
            for (let circle of circles) {
                const dx = circle.x - x;
                const dy = circle.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < circle.radius) {
                    overlap = true;
                    break;
                }
            }
        } while (overlap);
    
        bolt.style.left = `${x}px`;
        bolt.style.top = `${y}px`;
    
        bolt.addEventListener('mouseover', () => {
            lightningSound.play();
            bolt.style.opacity = '0'; // Hide the bolt on hover
        });
    
        gameArea.appendChild(bolt);
    }

    function createCircle(color) {
        let overlap, newCircle;
        do {
            overlap = false;
            const radius = Math.random() * 50 + 25; // random radius between 25 and 75
            const x = Math.random() * (window.innerWidth - radius * 2) + radius;
            const y = Math.random() * (window.innerHeight - radius * 2) + radius;

            newCircle = { x, y, radius, color };

            for (let circle of circles) {
                if (circlesOverlap(circle, newCircle)) {
                    overlap = true;
                    break;
                }
            }
        } while (overlap);

        const circleElem = document.createElement('div');
        circleElem.classList.add('circle');
        circleElem.style.backgroundColor = color;
        circleElem.style.width = circleElem.style.height = `${newCircle.radius * 2}px`;
        circleElem.style.left = `${newCircle.x - newCircle.radius}px`;
        circleElem.style.top = `${newCircle.y - newCircle.radius}px`;

        circleElem.addEventListener('mouseover', function() {
            if (newCircle.color === rainbowColors[currentColorIndex]) {
                const soundFile = 'sounds/pop2.wav'; // Adjust sound file path
                const sound = new Audio(soundFile);
                sound.play();
                circleElem.remove();
                circles = circles.filter(c => c !== newCircle);

                if (circles.every(c => c.color !== rainbowColors[currentColorIndex])) {
                    currentColorIndex++;
                    if (currentColorIndex >= rainbowColors.length) {
                        const tada = new Audio('sounds/tada.wav');
                        tada.play();
                        alert('Game Over! You completed the rainbow order.');
                    }
                }
            }
        });

        gameArea.appendChild(circleElem);
        circles.push(newCircle);
    }
});
