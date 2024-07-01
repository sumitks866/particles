var canvas;
let mouseX = 0;
let mouseY = 0;
const linkDistance = 150;
const mouseAttractionDistance = 200;

class Particle {
  props = {
    color: "#000",
    opacity: 1,
    velocity: 10,
  };

  constructor(props) {
    this.props = { ...this.props, ...props };
    this.radius = getRandomInt(1, 2);
    this.x = getRandomInt(this.radius, canvas.width - this.radius);
    this.y = getRandomInt(this.radius, canvas.height - this.radius);
    this.velocity = {
      x: (Math.random() * 2 - 1) * 1.2,
      y: (Math.random() * 2 - 1) * 1.2,
    };
    this.originalVelocity = { ...this.velocity }; // Store original velocity
    this.attractionRadius = 200; // Attraction radius to the mouse cursor
    this.attractionForce = 0.00002; // Attraction force multiplier
  }

  updatePosition() {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

    if (distanceToMouse < this.attractionRadius) {
      const attractionMultiplier =
        this.attractionForce * (this.attractionRadius - distanceToMouse);

      this.velocity.x += dx * attractionMultiplier;
      this.velocity.y += dy * attractionMultiplier;
    } else {
      this.velocity.x = this.originalVelocity.x;
      this.velocity.y = this.originalVelocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Bounce off the edges of the canvas
    if (this.x < this.radius || this.x > canvas.width - this.radius) {
      // this.direction = this.direction;
      this.velocity.x *= -1;
    }
    if (this.y < this.radius || this.y > canvas.height - this.radius) {
      // this.direction = -this.direction;
      this.velocity.y *= -1;
    }
  }

  distanceTo(otherParticle) {
    const dx = this.x - otherParticle.x;
    const dy = this.y - otherParticle.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    const p = this;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.props.color;
    ctx.fill();
    ctx.closePath();
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function particleAccelerator() {
  const ctx = canvas.getContext("2d");
  const particles = [];

  for (let i = 0; i < 200; i++) {
    const p = new Particle({
      // color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
      color: "#fff",
      opacity: Math.random(),
    });
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    particles.forEach((p, id) => {
      p.updatePosition();
      p.draw();

      particles.slice(id + 1).forEach((p2) => {
        const distance = p.distanceTo(p2);
        if (distance < linkDistance) {
          const alpha = 1 - distance / linkDistance;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.closePath();
        }
      });
    });

    requestAnimationFrame(animate); // Continue the animation
  }
  animate(); // Start the animation
}

function ParticleGenerator() {
  canvas = document.getElementById("particles-canvas");
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;
  particleAccelerator(canvas);
  canvas.addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });
}

ParticleGenerator();
