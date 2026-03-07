import { Link } from "react-router-dom";
import grupajesImg from "../../assets/Grupajes.png";
import guardamueblesImg from "../../assets/Guardamuebles.png";
import hogarImg from "../../assets/Hogares.png";
import oficinasImg from "../../assets/Oficinas.png";

const Services = () => {
	const services = [
		{
			id: 1,
			title: "Mudanzas hogar",
			image: hogarImg,
			link: "/proyectos/zerodelay/servicios",
		},
		{
			id: 2,
			title: "Guardamuebles",
			image: guardamueblesImg,
			link: "/proyectos/zerodelay/servicios",
		},
		{
			id: 3,
			title: "Traslados de Oficinas",
			image: oficinasImg,
			link: "/proyectos/zerodelay/servicios",
		},
		{
			id: 4,
			title: "Grupajes",
			image: grupajesImg,
			link: "/proyectos/zerodelay/servicios",
		},
	];

	return (
		<section style={{ padding: "5rem 2rem", backgroundColor: "#FFFFFF" }}>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				{/* Tabs */}
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "2rem",
						marginBottom: "3rem",
						flexWrap: "wrap",
						borderBottom: "2px solid #E0E0E0",
						paddingBottom: "1rem",
					}}
				>
					<button
						style={{
							background: "none",
							border: "none",
							color: "#1A237E",
							fontSize: "1.125rem",
							fontWeight: "700",
							cursor: "pointer",
							paddingBottom: "0.5rem",
							borderBottom: "3px solid #2196F3",
						}}
					>
						Mudanzas y Guardamuebles
					</button>
					<button
						style={{
							background: "none",
							border: "none",
							color: "#666666",
							fontSize: "1.125rem",
							fontWeight: "600",
							cursor: "pointer",
							paddingBottom: "0.5rem",
							borderBottom: "3px solid transparent",
						}}
					>
						Mudanzas Internacionales
					</button>
					<button
						style={{
							background: "none",
							border: "none",
							color: "#666666",
							fontSize: "1.125rem",
							fontWeight: "600",
							cursor: "pointer",
							paddingBottom: "0.5rem",
							borderBottom: "3px solid transparent",
						}}
					>
						Empresa de Mudanzas
					</button>
					<button
						style={{
							background: "none",
							border: "none",
							color: "#666666",
							fontSize: "1.125rem",
							fontWeight: "600",
							cursor: "pointer",
							paddingBottom: "0.5rem",
							borderBottom: "3px solid transparent",
						}}
					>
						Servicio de Mudanzas
					</button>
				</div>

				{/* Services Grid */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
						gap: "1.5rem",
					}}
				>
					{services.map((service) => (
						<Link
							key={service.id}
							to={service.link}
							style={{
								position: "relative",
								height: "300px",
								borderRadius: "12px",
								overflow: "hidden",
								textDecoration: "none",
								display: "block",
								boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
								transition: "transform 0.3s, box-shadow 0.3s",
							}}
							onMouseOver={(e) => {
								e.currentTarget.style.transform = "translateY(-4px)";
								e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
							}}
							onMouseOut={(e) => {
								e.currentTarget.style.transform = "translateY(0)";
								e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
							}}
						>
							{/* Background Image */}
							<div
								style={{
									position: "absolute",
									inset: 0,
									backgroundImage: `url(${service.image})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									transition: "transform 0.3s",
								}}
							></div>

							{/* Overlay */}
							<div
								style={{
									position: "absolute",
									inset: 0,
									background:
										"linear-gradient(to top, rgba(26, 35, 126, 0.9), rgba(26, 35, 126, 0.4))",
									display: "flex",
									alignItems: "flex-end",
									padding: "2rem",
								}}
							>
								<h3
									style={{
										color: "#FFFFFF",
										fontSize: "1.75rem",
										fontWeight: "700",
										margin: 0,
										textShadow: "0 2px 4px rgba(0,0,0,0.3)",
									}}
								>
									{service.title}
								</h3>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

export default Services;
