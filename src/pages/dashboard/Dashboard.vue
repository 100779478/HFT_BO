<style lang="less">
.bck {
  height: 90%;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.title {
  margin: 30px;
  color: #070707;
  font-size: 2rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 2; /* 确保标题在canvas上层 */
  position: relative; /* 确保z-index生效 */
}

.curEnv {
  width: 300px;
  font-size: 22px;
  font-weight: bolder;
  color: #070707;
  text-align: center;
  margin: 20px auto 0 auto;
  z-index: 2; /* 确保当前环境文字在canvas上层 */
  position: relative; /* 确保z-index生效 */
}

.shine-span {
  background: black linear-gradient(to left, transparent, rgba(255, 255, 255, 0.8), transparent) no-repeat 0 0;
  background-size: 10% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: shine 4s linear infinite;
}

@keyframes shine {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 0;
  }
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; /* 确保canvas在最底层 */
}
</style>

<template>
  <div class="bck">
    <!--    <canvas ref="canvas"></canvas>-->
    <h1 class="title shine-span">欢迎使用本系统</h1>
    <div class="curEnv title" id="currentEnv">
      当前环境为：{{ currentEnv }}
    </div>
  </div>
</template>

<script>
import introMixin from "@/mixins/introMixin";

export default {
  mixins: [introMixin],
  mounted() {
    // this.initCanvas();
  },
  computed: {
    currentEnv() {
      return this.$store.state.environment.currentEnv || '未选择';
    },
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ["#ffffff", "#ff99cc", "#ccffff", "#99ffcc", "#ffcc99"];
      const maxParticles = 200;

      function Particle(x, y, radius) {
        this.init(x, y, radius);
      }

      Particle.prototype.init = function (x, y, radius) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.radius = radius || Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.dx = (Math.random() - 0.5) * 4;
        this.dy = (Math.random() - 0.5) * 4;
        this.alpha = 1;
        this.life = Math.random() * 50 + 50;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.2;
        this.growth = Math.random() * 0.02;
      };

      Particle.prototype.draw = function () {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      };

      Particle.prototype.update = function () {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
        this.angle += this.spin;
        this.radius += this.growth;
        this.alpha -= 1 / this.life;

        this.draw();

        if (this.alpha <= 0 || this.radius <= 0) {
          this.init();
        }
      };

      function initParticles() {
        for (let i = 0; i < maxParticles; i++) {
          const particle = new Particle();
          particles.push(particle);
        }
      }

      function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => particle.update());
      }

      initParticles();
      animate();
    },
  },
};
</script>
