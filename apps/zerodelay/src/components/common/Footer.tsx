import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer
			style={{
				backgroundColor: "#1A237E",
				color: "#FFFFFF",
				padding: "3rem 2rem 2rem",
			}}
		>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				{/* Main Footer Content */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns:
							window.innerWidth >= 768 ? "repeat(4, 1fr)" : "1fr",
						gap: "2rem",
						marginBottom: "2rem",
					}}
				>
					{/* Column 1: Company Info */}
					<div>
						<h3
							style={{
								fontSize: "1.25rem",
								fontWeight: "700",
								marginBottom: "1rem",
							}}
						>
							Zero Delay Mudanzas
						</h3>
						<p
							style={{ fontSize: "0.875rem", lineHeight: "1.6", opacity: 0.9 }}
						>
							Empresa de mudanzas en Madrid con más de 15 años de experiencia.
							Profesionalidad y trato cercano.
						</p>
					</div>

					{/* Column 2: Links */}
					<div>
						<h4
							style={{
								fontSize: "1rem",
								fontWeight: "600",
								marginBottom: "1rem",
							}}
						>
							Enlaces
						</h4>
						<ul
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "0.5rem",
							}}
						>
							<li>
								<Link
									to="/proyectos/zero-delay"
									style={{
										color: "#FFFFFF",
										textDecoration: "none",
										fontSize: "0.875rem",
										opacity: 0.9,
										transition: "opacity 0.3s",
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.opacity = "1";
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.opacity = "0.9";
									}}
								>
									Inicio
								</Link>
							</li>
							<li>
								<Link
									to="/proyectos/zero-delay/servicios"
									style={{
										color: "#FFFFFF",
										textDecoration: "none",
										fontSize: "0.875rem",
										opacity: 0.9,
										transition: "opacity 0.3s",
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.opacity = "1";
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.opacity = "0.9";
									}}
								>
									Servicios
								</Link>
							</li>
							<li>
								<Link
									to="/proyectos/zero-delay/contacto"
									style={{
										color: "#FFFFFF",
										textDecoration: "none",
										fontSize: "0.875rem",
										opacity: 0.9,
										transition: "opacity 0.3s",
									}}
									onMouseOver={(e) => {
										e.currentTarget.style.opacity = "1";
									}}
									onMouseOut={(e) => {
										e.currentTarget.style.opacity = "0.9";
									}}
								>
									Contacto
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Contact */}
					<div>
						<h4
							style={{
								fontSize: "1rem",
								fontWeight: "600",
								marginBottom: "1rem",
							}}
						>
							Contacto
						</h4>
						<ul
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "0.5rem",
							}}
						>
							<li style={{ fontSize: "0.875rem", opacity: 0.9 }}>
								📞{" "}
								<a
									href="tel:911234567"
									style={{ color: "#FFFFFF", textDecoration: "none" }}
								>
									91 123 45 67
								</a>
							</li>
							<li style={{ fontSize: "0.875rem", opacity: 0.9 }}>
								📱{" "}
								<a
									href="tel:612345678"
									style={{ color: "#FFFFFF", textDecoration: "none" }}
								>
									612 34 56 78
								</a>
							</li>
							<li style={{ fontSize: "0.875rem", opacity: 0.9 }}>
								✉️{" "}
								<a
									href="mailto:info@zerodelay.es"
									style={{ color: "#FFFFFF", textDecoration: "none" }}
								>
									info@zerodelay.es
								</a>
							</li>
						</ul>
					</div>

					{/* Column 4: Hours */}
					<div>
						<h4
							style={{
								fontSize: "1rem",
								fontWeight: "600",
								marginBottom: "1rem",
							}}
						>
							Horarios
						</h4>
						<p
							style={{ fontSize: "0.875rem", opacity: 0.9, lineHeight: "1.6" }}
						>
							L-V: 8:00 - 20:00h
							<br />
							S: 9:00 - 14:00h
						</p>
					</div>
				</div>

				{/* Footer Bottom */}
				<div
					style={{
						display: "flex",
						flexDirection: window.innerWidth >= 768 ? "row" : "column",
						justifyContent: "space-between",
						alignItems: "center",
						gap: "1rem",
						paddingTop: "2rem",
						borderTop: "1px solid rgba(255, 255, 255, 0.1)",
						fontSize: "0.875rem",
						opacity: 0.8,
					}}
				>
					<p>© 2026 Zero Delay Mudanzas. Todos los derechos reservados.</p>
					<div style={{ display: "flex", gap: "1.5rem" }}>
						<Link
							to="/proyectos/zero-delay/aviso-legal"
							style={{
								color: "#FFFFFF",
								textDecoration: "none",
								transition: "opacity 0.3s",
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.opacity = "0.6";
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.opacity = "1";
							}}
						>
							Aviso Legal
						</Link>
						<Link
							to="/proyectos/zero-delay/privacidad"
							style={{
								color: "#FFFFFF",
								textDecoration: "none",
								transition: "opacity 0.3s",
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.opacity = "0.6";
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.opacity = "1";
							}}
						>
							Privacidad
						</Link>
						<Link
							to="/proyectos/zero-delay/cookies"
							style={{
								color: "#FFFFFF",
								textDecoration: "none",
								transition: "opacity 0.3s",
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.opacity = "0.6";
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.opacity = "1";
							}}
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
