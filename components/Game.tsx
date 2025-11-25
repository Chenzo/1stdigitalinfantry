 "use client";

import { useEffect, useRef } from "react";
import { Application, Assets, Sprite } from "pixi.js";

export default function Game() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let app: Application | null = null;
    let destroyed = false;
    const keys = new Set<string>();
    let removeHandlers: (() => void) | null = null;

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

      container.appendChild(app.canvas);

      const texture = await Assets.load("/sprites/tank-00.svg");
      const tank = new Sprite(texture);
      tank.anchor.set(0.5);
      tank.scale.set(0.5);
      tank.position.set(app.renderer.width / 2, app.renderer.height / 2);
      app.stage.addChild(tank);

      const speed = 3;
      const rotationSpeed = 0.05;

      const handleKeyDown = (event: KeyboardEvent) => {
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

      app.ticker.add((ticker) => {
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
      });

      app.renderer.on("resize", (width, height) => {
        tank.position.set(width / 2, height / 2);
      });

      app.start();
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
