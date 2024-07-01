var canvas;
let mouseX = 0;
let mouseY = 0;
const linkDistance = 150;

class Particle {
  props = {
    color: "#fff",
    opacity: 1,
  };

  constructor(radius, x, y) {
    // this.props = { ...this.props, ...props };
    this.radius = getRandomInt(1, 2);
    this.x = getRandomInt(this.radius, canvas.width - this.radius);
    this.y = getRandomInt(this.radius, canvas.height - this.radius);
    this.velocity = {
      x: (Math.random() * 2 - 1) * 1.1,
      y: (Math.random() * 2 - 1) * 1.1,
    };
    this.originalVelocity = { ...this.velocity }; // Store original velocity
    this.attractionRadius = 300; // Attraction radius to the mouse cursor
    this.attractionForce = 0.00005; // Attraction force multiplier
  }

  updatePosition() {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

    // if (distanceToMouse < this.attractionRadius) {
    //   const attractionMultiplier =
    //     this.attractionForce * (this.attractionRadius - distanceToMouse);

    //   this.velocity.x += dx * attractionMultiplier;
    //   this.velocity.y += dy * attractionMultiplier;
    // } else {
    this.velocity.x = this.originalVelocity.x;
    this.velocity.y = this.originalVelocity.y;
    // }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Bounce off the edges of the canvas
    if (this.x < 0) {
      this.x = canvas.width;
    } else if (this.x > canvas.width) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = canvas.height;
    } else if (this.y > canvas.height) {
      this.y = 0;
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

function getDistance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function drawLine(x1, y1, x2, y2, alpha = 1) {
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();
}

function particleAccelerator() {
  const ctx = canvas.getContext("2d");
  const particles = [];

  for (let i = 0; i < 200; i++) {
    const p = new Particle({
      color: "#fff",
      opacity: Math.random(),
    });
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, id) => {
      p.updatePosition();
      p.draw();

      const mouseDistance = getDistance(p.x, p.y, mouseX, mouseY);
      if (mouseDistance <= p.attractionRadius) {
        drawLine(
          p.x,
          p.y,
          mouseX,
          mouseY,
          1 - mouseDistance / p.attractionRadius
        );
      }

      particles.slice(id + 1).forEach((p2) => {
        const distance = p.distanceTo(p2);
        if (distance < linkDistance) {
          const alpha = 1 - distance / linkDistance;
          drawLine(p.x, p.y, p2.x, p2.y, alpha);
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
