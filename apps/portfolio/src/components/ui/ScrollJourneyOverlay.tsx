import {
	motion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollJourneyOverlay() {
	const { scrollYProgress } = useScroll();
	const progress = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 30,
		restDelta: 0.001,
	});
	const [travelDistance, setTravelDistance] = useState(0);
	const markerY = useTransform(progress, [0, 1], [0, travelDistance]);
	const markerRotation = useTransform(
		progress,
		[0, 1],
		["rotateX(-22deg) rotateY(0deg)", "rotateX(-22deg) rotateY(720deg)"],
	);
	const orbitRotation = useTransform(progress, [0, 1], ["-32deg", "328deg"]);
	useEffect(() => {
		const updateViewport = () => {
			setTravelDistance(Math.max(window.innerHeight - 142, 120));
		};
		updateViewport();
		window.addEventListener("resize", updateViewport, { passive: true });
		return () => window.removeEventListener("resize", updateViewport);
	}, []);

	return (
		<div
				aria-hidden="true"
				className="pointer-events-none fixed bottom-6 right-0 top-[88px] z-30 w-3 sm:right-3 sm:w-8"
			>
				<div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-white/10" />
				<motion.div
					className="absolute left-1/2 top-0 h-full w-px origin-top -translate-x-1/2 bg-[#0077CC]/75"
					style={{ scaleY: progress }}
				/>

				{[25, 50, 75].map((point) => (
					<span
						key={point}
						className="absolute left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#4DB7FF]/70"
						style={{ top: `${point}%` }}
					/>
				))}

				<motion.div
					className="absolute left-1/2 top-0 grid h-7 w-7 -translate-x-1/2 place-items-center sm:h-8 sm:w-8"
					style={{ y: markerY, perspective: 140 }}
				>
					<motion.svg
						viewBox="0 0 36 18"
						fill="none"
						className="absolute hidden h-8 w-8 sm:block sm:h-9 sm:w-9"
						style={{ rotate: orbitRotation }}
					>
						<ellipse
							cx="18"
							cy="9"
							rx="15.5"
							ry="5.5"
							stroke="#0077CC"
							strokeOpacity=".78"
							strokeWidth=".8"
						/>
						<circle cx="31.5" cy="7" r="1.25" fill="#A7DCFF" />
					</motion.svg>

					<motion.span
						className="relative block h-[17px] w-[17px] sm:h-[19px] sm:w-[19px]"
						style={{ transform: markerRotation, transformStyle: "preserve-3d" }}
					>
						<span
							className="absolute inset-0 rounded-[3px] border border-white/55 bg-gradient-to-br from-[#8CD4FF] via-[#0077CC] to-[#004B8A] shadow-[0_0_18px_rgba(0,119,204,0.68)]"
							style={{ transform: "translateZ(8.5px)", backfaceVisibility: "hidden" }}
						/>
						<span
							className="absolute inset-0 rounded-[3px] border border-white/25 bg-[#005EA9]"
							style={{ transform: "rotateY(180deg) translateZ(8.5px)", backfaceVisibility: "hidden" }}
						/>
						<span
							className="absolute inset-0 rounded-[3px] border border-white/20 bg-[#168CE0]"
							style={{ transform: "rotateY(90deg) translateZ(8.5px)", backfaceVisibility: "hidden" }}
						/>
						<span
							className="absolute inset-0 rounded-[3px] border border-black/20 bg-[#004B8A]"
							style={{ transform: "rotateY(-90deg) translateZ(8.5px)", backfaceVisibility: "hidden" }}
						/>
						<span
							className="absolute inset-0 rounded-[3px] border border-white/45 bg-[#8CD4FF]"
							style={{ transform: "rotateX(90deg) translateZ(8.5px)", backfaceVisibility: "hidden" }}
						/>
						<span
							className="absolute inset-0 rounded-[3px] border border-black/30 bg-[#00345F]"
							style={{ transform: "rotateX(-90deg) translateZ(8.5px)", backfaceVisibility: "hidden" }}
						/>
					</motion.span>
				</motion.div>
		</div>
	);
}
