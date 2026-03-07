import { Link } from "react-router-dom";
import furgoneta from "../../assets/furgoneta-zerodelay.png";

const Hero = () => {
	return (
		<section
			style={{
				background: "#F5F5F5",
				color: "#333333",
				padding: "5rem 2rem 4rem",
				minHeight: "700px",
				display: "flex",
				alignItems: "center",
			}}
		>
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
					width: "100%",
					textAlign: "center",
				}}
			>
				{/* Título Principal */}
				<h1
					style={{
						fontSize: "clamp(2.5rem, 6vw, 4rem)",
						fontWeight: "300",
						lineHeight: "1.2",
						marginBottom: "1.5rem",
						color: "#1A237E",
						letterSpacing: "-0.02em",
					}}
				>
					mudanzas
					<br />
					<span style={{ fontWeight: "800" }}>profesionales</span>
				</h1>

				{/* Badges */}
				<div
					style={{
						display: "inline-block",
						background: "#1A237E",
						padding: "1rem 3rem",
						marginBottom: "1.5rem",
						borderRadius: "50px",
					}}
				>
					<p
						style={{
							color: "#FFFFFF",
							fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
							fontWeight: "600",
							margin: 0,
						}}
					>
						⚡ Mudanzas Nacionales e Internacionales • 📦 Guardamuebles • 👥
						Grupajes
					</p>
				</div>

				{/* Subtítulo */}
				<h2
					style={{
						fontSize: "clamp(1.5rem, 3vw, 2rem)",
						fontWeight: "600",
						marginBottom: "1rem",
						color: "#1A237E",
					}}
				>
					Mudanzas de Hogar y Oficina,
					<br />
					<span style={{ color: "#2196F3" }}>con todas las Garantías</span>
				</h2>

				{/* Descripción */}
				<p
					style={{
						fontSize: "1.125rem",
						lineHeight: "1.6",
						marginBottom: "2.5rem",
						color: "#666666",
						maxWidth: "700px",
						margin: "0 auto 2.5rem",
					}}
				>
					Realizamos Servicios a nivel Nacional e Internacional.
					<br />
					Disponemos de Guardamuebles (20.000m²).
				</p>

				{/* CTAs */}
				<div
					style={{
						display: "flex",
						gap: "1rem",
						justifyContent: "center",
						flexWrap: "wrap",
						marginBottom: "3rem",
					}}
				>
					<Link
						to="/proyectos/zero-delay/contacto"
						style={{
							padding: "1.25rem 3rem",
							background: "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)",
							color: "#FFFFFF",
							borderRadius: "50px",
							textDecoration: "none",
							fontWeight: "700",
							fontSize: "1.125rem",
							transition: "transform 0.2s, box-shadow 0.2s",
							boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
							display: "inline-block",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.boxShadow =
								"0 6px 16px rgba(76, 175, 80, 0.4)";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.boxShadow =
								"0 4px 12px rgba(76, 175, 80, 0.3)";
						}}
					>
						Pide Presupuesto
					</Link>
					<Link
						to="/proyectos/zero-delay/servicios"
						style={{
							padding: "1.25rem 3rem",
							backgroundColor: "transparent",
							color: "#1A237E",
							border: "2px solid #1A237E",
							borderRadius: "50px",
							textDecoration: "none",
							fontWeight: "600",
							fontSize: "1.125rem",
							transition: "all 0.2s",
							display: "inline-block",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = "#1A237E";
							e.currentTarget.style.color = "#FFFFFF";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = "transparent";
							e.currentTarget.style.color = "#1A237E";
						}}
					>
						Ver Servicios
					</Link>
				</div>

				{/* Imagen Furgoneta */}
				<div
					style={{
						position: "relative",
						maxWidth: "900px",
						margin: "0 auto",
					}}
				>
					<img
						src={furgoneta}
						alt="Furgoneta Zero Delay Mudanzas"
						style={{
							maxWidth: "100%",
							height: "auto",
							filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
							animation: "float 3s ease-in-out infinite",
						}}
					/>
					<style>{`
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-10px); }
                        }
                    `}</style>
				</div>
			</div>
		</section>
	);
};

export default Hero;
