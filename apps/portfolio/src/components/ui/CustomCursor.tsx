import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
} from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
	const prefersReducedMotion = useReducedMotion() ?? false;
	const [enabled, setEnabled] = useState(false);
	const [cursorLabel, setCursorLabel] = useState<string | null>(null);

	const mouseX = useMotionValue(-100);
	const mouseY = useMotionValue(-100);
	const smoothX = useSpring(mouseX, { stiffness: 420, damping: 32, mass: 0.4 });
	const smoothY = useSpring(mouseY, { stiffness: 420, damping: 32, mass: 0.4 });

	useEffect(() => {
		if (
			prefersReducedMotion ||
			!window.matchMedia("(hover: hover) and (pointer: fine)").matches
		)
			return;
		const media = window.matchMedia("(pointer: fine)");
		if (!media.matches) return;
		setEnabled(true);

		const handleMove = (event: PointerEvent) => {
			mouseX.set(event.clientX);
			mouseY.set(event.clientY);
			const target = event.target as HTMLElement | null;
			const cursorEl = target?.closest<HTMLElement>("[data-cursor]");
			setCursorLabel(cursorEl?.dataset.cursor ?? null);
		};

		const handleLeave = () => setCursorLabel(null);

		window.addEventListener("pointermove", handleMove, { passive: true });
		document.addEventListener("mouseleave", handleLeave);

		return () => {
			window.removeEventListener("pointermove", handleMove);
			document.removeEventListener("mouseleave", handleLeave);
		};
	}, [mouseX, mouseY, prefersReducedMotion]);

	if (!enabled || prefersReducedMotion) return null;

	return (
		<motion.div
			aria-hidden="true"
			style={{
				x: smoothX,
				y: smoothY,
				translateX: "-50%",
				translateY: "-50%",
			}}
			animate={{
				scale: cursorLabel ? 1 : 0.45,
				opacity: cursorLabel ? 1 : 0,
			}}
			transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
			className="pointer-events-none fixed left-0 top-0 z-50 hidden items-center justify-center rounded-full bg-[#0077CC] px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-white shadow-xl lg:flex"
		>
			{cursorLabel}
		</motion.div>
	);
}
