const Testimonials = () => {
	const testimonials = [
		{
			id: 1,
			name: "María García",
			service: "Mudanza de Hogar",
			rating: 5,
			text: "Excelente servicio. Puntuales, cuidadosos y muy profesionales. La mudanza fue rápida y sin ningún problema.",
		},
		{
			id: 2,
			name: "Carlos Rodríguez",
			service: "Mudanza de Oficina",
			rating: 5,
			text: "Contraté sus servicios para trasladar mi oficina y superaron todas mis expectativas. Cero demoras, tal como prometen.",
		},
		{
			id: 3,
			name: "Ana Martínez",
			service: "Guardamuebles",
			rating: 5,
			text: "Necesitaba guardar mis muebles durante 3 meses. Las instalaciones son excelentes y el personal muy atento.",
		},
	];

	return (
		<section style={{ padding: "5rem 2rem", backgroundColor: "#F9F9F9" }}>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				<div style={{ textAlign: "center", marginBottom: "4rem" }}>
					<h2
						style={{
							fontSize: "2.25rem",
							fontWeight: "700",
							color: "#1A237E",
							marginBottom: "1rem",
						}}
					>
						Lo Que Dicen Nuestros Clientes
					</h2>
					<p
						style={{
							fontSize: "1.125rem",
							color: "#666",
							maxWidth: "700px",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						La satisfacción de nuestros clientes es nuestra mejor carta de
						presentación.
					</p>
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
						gap: "2rem",
					}}
				>
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.id}
							style={{
								backgroundColor: "#FFFFFF",
								padding: "2rem",
								borderRadius: "12px",
								boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
								position: "relative",
							}}
						>
							{/* Quote icon */}
							<div
								style={{
									position: "absolute",
									top: "-15px",
									left: "20px",
									width: "40px",
									height: "40px",
									backgroundColor: "#4CAF50",
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "#FFFFFF",
									fontSize: "1.5rem",
									fontWeight: "bold",
								}}
							>
								"
							</div>

							{/* Stars */}
							<div
								style={{
									display: "flex",
									gap: "0.25rem",
									marginBottom: "1rem",
									marginTop: "1rem",
								}}
							>
								{[...Array(testimonial.rating)].map((_, i) => (
									<span
										key={i}
										style={{ color: "#FFC107", fontSize: "1.25rem" }}
									>
										★
									</span>
								))}
							</div>

							{/* Text */}
							<p
								style={{
									color: "#666666",
									lineHeight: "1.6",
									marginBottom: "1.5rem",
									fontStyle: "italic",
								}}
							>
								{testimonial.text}
							</p>

							{/* Author */}
							<div
								style={{ borderTop: "1px solid #E0E0E0", paddingTop: "1rem" }}
							>
								<p
									style={{
										fontWeight: "600",
										color: "#1A237E",
										marginBottom: "0.25rem",
									}}
								>
									{testimonial.name}
								</p>
								<p style={{ fontSize: "0.875rem", color: "#999999" }}>
									{testimonial.service}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
