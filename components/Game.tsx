 "use client";

import { useEffect, useRef } from "react";
import { Application, Graphics } from "pixi.js";

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

      const square = new Graphics();
      square.rect(0, 0, 100, 100).fill({ color: 0xff0000 }); 
      square.pivot.set(50, 50);
      square.position.set(app.renderer.width / 2, app.renderer.height / 2);
      app.stage.addChild(square);

      app.ticker.add((ticker) => {
        // deltaTime is a number (~1 at 60fps)
        square.rotation += 0.01 * ticker.deltaTime;
      });

      app.renderer.on("resize", (width, height) => {
        square.position.set(width / 2, height / 2);
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
