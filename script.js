const roles = [
			"Backend Architect",
			"Technical Lead",
			"System Design Expert"
		];

		let i = 0,
			j = 0,
			current = "",
			isDeleting = false;

		function type() {
			current = roles[i];

			if (isDeleting) {
				j--;
			} else {
				j++;
			}

			document.getElementById("typing").innerHTML = current.substring(0, j);

			if (!isDeleting && j === current.length) {
				isDeleting = true;
				setTimeout(type, 1200);
				return;
			}

			if (isDeleting && j === 0) {
				isDeleting = false;
				i = (i + 1) % roles.length;
			}

			setTimeout(type, isDeleting ? 50 : 100);
		}

const canvas = document.getElementById("particles");
		const ctx = canvas.getContext("2d");

		let particles = [];
		let mouse = {
			x: null,
			y: null
		};

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		window.addEventListener("mousemove", e => {
			mouse.x = e.x;
			mouse.y = e.y;
		});

		class Particle {
			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.size = Math.random() * 2 + 1;
				this.speedX = Math.random() * 0.5 - 0.25;
				this.speedY = Math.random() * 0.5 - 0.25;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				let dx = this.x - mouse.x;
				let dy = this.y - mouse.y;
				let dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < 100) {
					this.x += dx / 10;
					this.y += dy / 10;
				}
			}

			draw() {
				ctx.fillStyle = "#38bdf8";
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		function init() {
			particles = [];
			for (let i = 0; i < 100; i++) {
				particles.push(new Particle());
			}
		}

		function connect() {
			for (let a = 0; a < particles.length; a++) {
				for (let b = a; b < particles.length; b++) {
					let dx = particles[a].x - particles[b].x;
					let dy = particles[a].y - particles[b].y;
					let distance = dx * dx + dy * dy;

					if (distance < 8000) {
						ctx.strokeStyle = "rgba(56,189,248,0.08)";
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(particles[a].x, particles[a].y);
						ctx.lineTo(particles[b].x, particles[b].y);
						ctx.stroke();
					}
				}
			}
		}

		function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach(p => {
				p.update();
				p.draw();
			});

			connect();
			requestAnimationFrame(animate);
		}

		init();
		animate();

		type();
