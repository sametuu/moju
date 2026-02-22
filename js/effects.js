const Effects = {
  flash: { active: false, type: null, progress: 0, duration: 350, sparkles: [] },
  levelUp: { active: false, progress: 0, duration: 1200, particles: [] },
  evolution: {
    active: false,
    progress: 0,
    duration: 2500,
    oldCharId: null,
    newCharId: null,
    onComplete: null
  },

  triggerFlash(positive, centerX, centerY) {
    const cx = centerX ?? window.innerWidth / 2;
    const cy = centerY ?? window.innerHeight / 2;
    const sparkles = positive ? Array.from({ length: 12 }, () => ({
      x: cx + (Math.random() - 0.5) * 120,
      y: cy + (Math.random() - 0.5) * 120,
      size: Math.random() * 6 + 2,
      alpha: 1
    })) : [];
    this.flash = {
      active: true,
      type: positive ? 'positive' : 'negative',
      progress: 0,
      duration: 350,
      sparkles
    };
  },

  triggerLevelUp() {
    this.levelUp = {
      active: true,
      progress: 0,
      duration: 1200,
      particles: this.createLevelUpParticles(CharacterManager.x, CharacterManager.y)
    };
  },

  createLevelUpParticles(cx, cy) {
    const x = cx ?? window.innerWidth / 2;
    const y = cy ?? window.innerHeight / 2;
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 6 - 4,
        size: Math.random() * 8 + 4,
        alpha: 1,
        color: ['#ffd700', '#fff8dc', '#ffeb3b', '#fff59d'][Math.floor(Math.random() * 4)]
      });
    }
    return particles;
  },

  triggerEvolution(oldCharId, newCharId, onComplete) {
    this.evolution = {
      active: true,
      progress: 0,
      duration: 2500,
      oldCharId,
      newCharId,
      onComplete
    };
  },

  update(dt) {
    if (this.flash.active) {
      this.flash.progress += dt * 1000;
      if (this.flash.progress >= this.flash.duration) {
        this.flash.active = false;
      }
    }

    if (this.levelUp.active) {
      this.levelUp.progress += dt * 1000;
      for (const p of this.levelUp.particles) {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.vy += 0.4 * (dt / 16);
        p.alpha = Math.max(0, 1 - this.levelUp.progress / this.levelUp.duration);
      }
      if (this.levelUp.progress >= this.levelUp.duration) {
        this.levelUp.active = false;
      }
    }

    if (this.evolution.active) {
      this.evolution.progress += dt * 1000;
      if (this.evolution.progress >= this.evolution.duration) {
        this.evolution.active = false;
        if (this.evolution.onComplete) this.evolution.onComplete();
      }
    }
  },

  drawFlash(ctx) {
    if (!this.flash.active) return;
    const t = this.flash.progress / this.flash.duration;
    const easeOut = 1 - Math.pow(1 - t, 2);
    const alpha = Math.sin(easeOut * Math.PI) * 0.6;

    ctx.save();
    if (this.flash.type === 'positive') {
      const gradient = ctx.createRadialGradient(
        window.innerWidth / 2, window.innerHeight / 2, 0,
        window.innerWidth / 2, window.innerHeight / 2, window.innerWidth
      );
      gradient.addColorStop(0, `rgba(255, 255, 200, ${alpha * 0.9})`);
      gradient.addColorStop(0.3, `rgba(255, 215, 0, ${alpha * 0.5})`);
      gradient.addColorStop(0.6, `rgba(255, 255, 255, ${alpha * 0.2})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of this.flash.sparkles || []) {
        const sparkleAlpha = alpha * (1 - t) * 0.9;
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      const gradient = ctx.createRadialGradient(
        window.innerWidth / 2, window.innerHeight / 2, 0,
        window.innerWidth / 2, window.innerHeight / 2, window.innerWidth * 0.8
      );
      gradient.addColorStop(0, `rgba(139, 0, 0, ${alpha * 0.6})`);
      gradient.addColorStop(0.4, `rgba(80, 0, 80, ${alpha * 0.5})`);
      gradient.addColorStop(0.8, `rgba(25, 0, 25, ${alpha * 0.3})`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
    ctx.restore();
  },

  drawLevelUp(ctx) {
    if (!this.levelUp.active) return;
    const t = this.levelUp.progress / this.levelUp.duration;

    for (const p of this.levelUp.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const textAlpha = t < 0.3 ? t / 0.3 : (t > 0.7 ? (1 - t) / 0.3 : 1);
    ctx.save();
    ctx.globalAlpha = textAlpha;
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 4;
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeText('LEVEL UP!', window.innerWidth / 2, window.innerHeight / 2 - 20);
    ctx.fillText('LEVEL UP!', window.innerWidth / 2, window.innerHeight / 2 - 20);
    ctx.restore();
  },

  drawEvolution(ctx, characterX, characterY, characterSize) {
    if (!this.evolution.active) return;
    const t = this.evolution.progress / this.evolution.duration;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (t < 0.2) {
      const a = t / 0.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.95})`;
      ctx.fillRect(0, 0, w, h);
    } else if (t < 0.4) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(0, 0, w, h);
      const fadeOut = (t - 0.2) / 0.2;
      const pulse = 1 + Math.sin(t * 50) * 0.08;
      ctx.save();
      ctx.globalAlpha = 1 - fadeOut;
      const img = CharacterManager.images[this.evolution.oldCharId];
      if (img && img.complete) {
        ctx.drawImage(img,
          characterX - characterSize * pulse / 2,
          characterY - characterSize * pulse / 2,
          characterSize * pulse,
          characterSize * pulse);
      }
      ctx.restore();
    } else if (t < 0.6) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(0, 0, w, h);
      const fadeIn = (t - 0.4) / 0.2;
      const scale = 0.3 + fadeIn * 0.7;
      ctx.save();
      ctx.globalAlpha = fadeIn;
      const img = CharacterManager.images[this.evolution.newCharId];
      if (img && img.complete) {
        ctx.drawImage(img,
          characterX - characterSize * scale / 2,
          characterY - characterSize * scale / 2,
          characterSize * scale,
          characterSize * scale);
      }
      ctx.restore();
    } else {
      const overlayAlpha = (t - 0.6) / 0.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(overlayAlpha * 0.3, 0.3)})`;
      ctx.fillRect(0, 0, w, h);
      const img = CharacterManager.images[this.evolution.newCharId];
      if (img && img.complete) {
        ctx.drawImage(img,
          characterX - characterSize / 2,
          characterY - characterSize / 2,
          characterSize,
          characterSize);
      }
      const char = CHARACTERS[this.evolution.newCharId];
      if (char) {
        ctx.fillStyle = `rgba(0,0,0,${0.9 - overlayAlpha * 0.5})`;
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('進化!', w / 2, h / 2 - 80);
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(char.name + ' に進化した!', w / 2, h / 2 - 45);
      }
    }
  },

  isEvolutionActive() {
    return this.evolution.active;
  }
};
