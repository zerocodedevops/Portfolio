import { Link } from "react-router-dom";

const CTASection = () => {
	return (
		<section
			style={{
				background: "linear-gradient(135deg, #1A237E 0%, #2196F3 100%)",
				color: "#FFFFFF",
				padding: "5rem 2rem",
				textAlign: "center",
			}}
		>
			<div style={{ maxWidth: "800px", margin: "0 auto" }}>
				<h2
					style={{
						fontSize: "clamp(2rem, 4vw, 3rem)",
						fontWeight: "800",
						marginBottom: "1.5rem",
					}}
				>
					¿Listo para tu Mudanza?
				</h2>
				<p
					style={{
						fontSize: "1.25rem",
						lineHeight: "1.6",
						marginBottom: "2.5rem",
						opacity: "0.9",
					}}
				>
					Solicita tu presupuesto sin compromiso. Nuestro equipo te responderá
					en menos de 24 horas.
				</p>
				<div
					style={{
						display: "flex",
						gap: "1rem",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<Link
						to="/proyectos/zero-delay/contacto"
						style={{
							padding: "1.25rem 2.5rem",
							backgroundColor: "#4CAF50",
							color: "#FFFFFF",
							borderRadius: "8px",
							textDecoration: "none",
							fontWeight: "700",
							fontSize: "1.125rem",
							transition: "transform 0.2s, box-shadow 0.2s",
							boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
							display: "inline-block",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.transform = "translateY(-2px)";
							e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform = "translateY(0)";
							e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
						}}
					>
						Solicitar Presupuesto Ahora
					</Link>
					<a
						href="tel:+34912345678"
						style={{
							padding: "1.25rem 2.5rem",
							backgroundColor: "transparent",
							color: "#FFFFFF",
							border: "2px solid #FFFFFF",
							borderRadius: "8px",
							textDecoration: "none",
							fontWeight: "600",
							fontSize: "1.125rem",
							transition: "background-color 0.2s",
							display: "inline-block",
						}}
						onMouseOver={(e) =>
							(e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")
						}
						onMouseOut={(e) =>
							(e.currentTarget.style.backgroundColor = "transparent")
						}
					>
						📞 Llamar Ahora
					</a>
				</div>

				{/* Trust badges */}
				<div
					style={{
						marginTop: "3rem",
						paddingTop: "2rem",
						borderTop: "1px solid rgba(255,255,255,0.2)",
						display: "flex",
						justifyContent: "center",
						gap: "3rem",
						flexWrap: "wrap",
					}}
				>
					<div>
						<div
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								marginBottom: "0.5rem",
							}}
						>
							+1500
						</div>
						<div style={{ fontSize: "0.875rem", opacity: "0.8" }}>
							Mudanzas Realizadas
						</div>
					</div>
					<div>
						<div
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								marginBottom: "0.5rem",
							}}
						>
							15+
						</div>
						<div style={{ fontSize: "0.875rem", opacity: "0.8" }}>
							Años de Experiencia
						</div>
					</div>
					<div>
						<div
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								marginBottom: "0.5rem",
							}}
						>
							98%
						</div>
						<div style={{ fontSize: "0.875rem", opacity: "0.8" }}>
							Clientes Satisfechos
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTASection;
