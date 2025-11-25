 "use client";

import { useEffect, useRef } from "react";
import { Application, Assets, Sprite } from "pixi.js";

export default function Game() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let app: Application | null = null;
    let destroyed = false;

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
      tank.position.set(app.renderer.width / 2, app.renderer.height / 2);
      app.stage.addChild(tank);

      app.ticker.add((ticker) => {
        tank.rotation += 0.01 * ticker.deltaTime;
      });

      app.renderer.on("resize", (width, height) => {
        tank.position.set(width / 2, height / 2);
      });

      app.start();
    };

    setup();

    return () => {
      destroyed = true;
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
