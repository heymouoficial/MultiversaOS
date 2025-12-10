
import React, { useEffect, useRef } from "react";

interface GhostCursorProps {
    color?: string;
    brightness?: number;
    edgeIntensity?: number;
    trailLength?: number;
    inertia?: number;
    grainIntensity?: number;
    bloomStrength?: number;
    bloomRadius?: number;
    bloomThreshold?: number;
    fadeDelayMs?: number;
    fadeDurationMs?: number;
}

const GhostCursor: React.FC<GhostCursorProps> = ({
    color = "#B19EEF",
    brightness = 1.2,
    edgeIntensity = 0.5,
    trailLength = 80, // Longer trail for fluidity
    inertia = 0.6, // Higher inertia for smoother movement
    grainIntensity = 0, // Remove grain for cleaner look
    bloomStrength = 0.5,
    bloomRadius = 2.0,
    bloomThreshold = 0.025,
    fadeDelayMs = 200, // Faster fade start
    fadeDurationMs = 2500, // Slower fade out
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<{ x: number; y: number; age: number }[]>([]);
    const lastPosRef = useRef<{ x: number; y: number } | null>(null);
    const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFadingRef = useRef(false);
    const fadeStartRef = useRef<number>(0);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set full screen
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16),
                }
                : { r: 177, g: 158, b: 239 }; // default
        };

        const rgb = hexToRgb(color);

        const addPoint = (x: number, y: number) => {
            pointsRef.current.push({ x, y, age: 0 });
            if (pointsRef.current.length > trailLength) {
                pointsRef.current.shift();
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            isFadingRef.current = false;
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);

            // Inertia logic
            if (!lastPosRef.current) {
                addPoint(e.clientX, e.clientY);
                lastPosRef.current = { x: e.clientX, y: e.clientY };
            } else {
                const dx = e.clientX - lastPosRef.current.x;
                const dy = e.clientY - lastPosRef.current.y;
                const newX = lastPosRef.current.x + dx * (1 - inertia);
                const newY = lastPosRef.current.y + dy * (1 - inertia);
                addPoint(newX, newY);
                lastPosRef.current = { x: newX, y: newY };
            }

            fadeTimeoutRef.current = setTimeout(() => {
                isFadingRef.current = true;
                fadeStartRef.current = Date.now();
            }, fadeDelayMs);
        };

        window.addEventListener("mousemove", handleMouseMove);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Standard clear

            // Draw Trail
            if (pointsRef.current.length > 1) {
                ctx.beginPath();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                let opacityMultiplier = 1;

                if (isFadingRef.current) {
                    const elapsed = Date.now() - fadeStartRef.current;
                    if (elapsed < fadeDurationMs) {
                        opacityMultiplier = 1 - (elapsed / fadeDurationMs);
                    } else {
                        opacityMultiplier = 0;
                        pointsRef.current = []; // Clear points
                    }
                }

                // Draw segments with fading age
                for (let i = 0; i < pointsRef.current.length - 1; i++) {
                    const p1 = pointsRef.current[i];
                    const p2 = pointsRef.current[i + 1];

                    const relativeAge = i / pointsRef.current.length; // 0 (old) to 1 (new)
                    // Cubic ease-in for smoother tail
                    const smoothedAge = relativeAge * relativeAge * relativeAge;

                    const alpha = smoothedAge * brightness * opacityMultiplier;

                    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                    ctx.lineWidth = smoothedAge * 45 * (1 + edgeIntensity); // Much wider

                    // Draw simple line segment
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [color, brightness, edgeIntensity, inertia, trailLength, fadeDelayMs, fadeDurationMs, bloomStrength, bloomRadius, grainIntensity]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-0"
            style={{
                mixBlendMode: 'screen',
                filter: 'blur(35px)' // Heavy blur for diffusion
            }}
        />
    );
};

export default GhostCursor;
