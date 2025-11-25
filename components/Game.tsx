 "use client";

import { useEffect, useRef } from "react";
import { Application, Assets, Sprite, Graphics } from "pixi.js";

export default function Game() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let app: Application | null = null;
    let destroyed = false;
    const keys = new Set<string>();
    let removeHandlers: (() => void) | null = null;
    const projectiles: { sprite: Graphics; vx: number; vy: number }[] = [];

    const setup = async () => {
      if (typeof window === "undefined") return;
      const container = containerRef.current;
      if (!container) return;

      app = new Application();
      await app.init({
        background: "#111111",
        resizeTo: container,
        antialias: true,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      const currentApp = app;

      container.appendChild(currentApp.canvas);

      const texture = await Assets.load("/sprites/tank-00.svg");
      const tank = new Sprite(texture);
      tank.anchor.set(0.5);
      tank.scale.set(0.5);
      tank.position.set(currentApp.renderer.width / 2, currentApp.renderer.height / 2);
      currentApp.stage.addChild(tank);

      const speed = 3;
      const rotationSpeed = 0.05;

      const fireProjectile = () => {
        const bullet = new Graphics();
        bullet.circle(0, 0, 5).fill({ color: 0xffff00 });

        const spawnDistance = tank.width * 0.6;
        const spawnX = tank.x + Math.cos(tank.rotation) * spawnDistance;
        const spawnY = tank.y + Math.sin(tank.rotation) * spawnDistance;
        bullet.position.set(spawnX, spawnY);

        const bulletSpeed = 8;
        const vx = Math.cos(tank.rotation) * bulletSpeed;
        const vy = Math.sin(tank.rotation) * bulletSpeed;

        projectiles.push({ sprite: bullet, vx, vy });
        currentApp.stage.addChild(bullet);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.code === "Space") {
          fireProjectile();
          return;
        }
        keys.add(event.key.toLowerCase());
      };

      const handleKeyUp = (event: KeyboardEvent) => {
        keys.delete(event.key.toLowerCase());
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      removeHandlers = () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };

      currentApp.ticker.add((ticker) => {
        const delta = ticker.deltaTime;

        if (keys.has("a") || keys.has("arrowleft")) {
          tank.rotation -= rotationSpeed * delta;
        }
        if (keys.has("d") || keys.has("arrowright")) {
          tank.rotation += rotationSpeed * delta;
        }
        if (keys.has("w") || keys.has("arrowup")) {
          tank.x += Math.cos(tank.rotation) * speed * delta;
          tank.y += Math.sin(tank.rotation) * speed * delta;
        }
        if (keys.has("s") || keys.has("arrowdown")) {
          tank.x -= Math.cos(tank.rotation) * speed * delta;
          tank.y -= Math.sin(tank.rotation) * speed * delta;
        }

        const halfW = tank.width / 2;
        const halfH = tank.height / 2;
        tank.x = Math.min(Math.max(tank.x, halfW), currentApp.renderer.width - halfW);
        tank.y = Math.min(Math.max(tank.y, halfH), currentApp.renderer.height - halfH);

        for (let i = projectiles.length - 1; i >= 0; i--) {
          const bullet = projectiles[i];
          bullet.sprite.x += bullet.vx * delta;
          bullet.sprite.y += bullet.vy * delta;

          const offscreen =
            bullet.sprite.x < 0 ||
            bullet.sprite.x > currentApp.renderer.width ||
            bullet.sprite.y < 0 ||
            bullet.sprite.y > currentApp.renderer.height;

          if (offscreen) {
            currentApp.stage.removeChild(bullet.sprite);
            bullet.sprite.destroy();
            projectiles.splice(i, 1);
          }
        }
      });

      currentApp.renderer.on("resize", (width, height) => {
        tank.position.set(width / 2, height / 2);
      });

      currentApp.start();
    };

    setup();

    return () => {
      destroyed = true;
      if (removeHandlers) {
        removeHandlers();
      }
      if (app) {
        app.destroy(true);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "#111111" }}
    />
  );
}
