import { useState } from "react";

interface PrivacyModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const PrivacyModal = ({ isOpen, onClose }: Readonly<PrivacyModalProps>) => {
	const [activeTab, setActiveTab] = useState<"categories" | "services">(
		"categories",
	);

	// State for toggles (mocked for UI purposes as functionality requires backend/cookie logic)
	const [toggles, setToggles] = useState({
		marketing: true,
		functional: true,
		essential: true,
		// Individual services
		googleAds: true,
		googleAnalytics: true,
		googleFonts: true,
		googleMaps: true,
		googleTagManager: true,
		reCaptcha: true,
	});

	if (!isOpen) return null;

	const toggleSwitch = (key: keyof typeof toggles) => {
		if (key === "essential") return; // Essential is always locked
		setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0,0,0,0.5)",
				zIndex: 9999,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "'Poppins', sans-serif",
			}}
		>
			<div
				style={{
					backgroundColor: "#fff",
					width: "100%",
					maxWidth: "600px",
					maxHeight: "90vh",
					borderRadius: "8px",
					display: "flex",
					flexDirection: "column",
					boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
					margin: "1rem",
				}}
			>
				{/* Header */}
				<div
					style={{
						padding: "1.5rem",
						borderBottom: "1px solid #eee",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}
				>
					<div>
						<h2
							style={{
								color: "#4CAF50",
								margin: "0 0 1rem 0",
								fontSize: "1.25rem",
							}}
						>
							Configuración de privacidad
						</h2>
						<p
							style={{
								margin: 0,
								fontSize: "0.875rem",
								color: "#666",
								lineHeight: "1.5",
							}}
						>
							Esta herramienta le ayuda a gestionar el consentimiento a las
							tecnologías de terceros que recopilan y tratan datos personales.
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						style={{
							background: "none",
							border: "none",
							fontSize: "1.5rem",
							cursor: "pointer",
							color: "#4CAF50",
						}}
					>
						×
					</button>
				</div>

				{/* Tabs */}
				<div style={{ display: "flex", borderBottom: "2px solid #eee" }}>
					<button
						type="button"
						onClick={() => setActiveTab("categories")}
						style={{
							flex: 1,
							padding: "1rem",
							border: "none",
							background: "none",
							borderBottom:
								activeTab === "categories" ? "2px solid #1A237E" : "none",
							color: activeTab === "categories" ? "#1A237E" : "#666",
							fontWeight: "600",
							cursor: "pointer",
						}}
					>
						Categorías
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("services")}
						style={{
							flex: 1,
							padding: "1rem",
							border: "none",
							background: "none",
							borderBottom:
								activeTab === "services" ? "2px solid #1A237E" : "none",
							color: activeTab === "services" ? "#1A237E" : "#666",
							fontWeight: "600",
							cursor: "pointer",
						}}
					>
						Servicios
					</button>
				</div>

				{/* Content */}
				<div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
					{activeTab === "categories" ? (
						<div
							style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
						>
							<ToggleItem
								title="Marketing"
								description="Los anunciantes utilizan estas tecnologías para publicar anuncios que sean relevantes para sus intereses."
								checked={toggles.marketing}
								onChange={() => toggleSwitch("marketing")}
							/>
							<ToggleItem
								title="Funcional"
								description="Estas tecnologías nos permiten analizar el comportamiento de uso para medir y mejorar el rendimiento."
								checked={toggles.functional}
								onChange={() => toggleSwitch("functional")}
							/>
							<ToggleItem
								title="Esencial"
								description="Estas tecnologías son necesarias para activar la funcionalidad principal de nuestro servicio."
								checked={true}
								disabled={true}
								onChange={() => { }}
							/>
						</div>
					) : (
						<div
							style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
						>
							<ToggleItem
								title="Google Ads"
								checked={toggles.googleAds}
								onChange={() => toggleSwitch("googleAds")}
								small
							/>
							<ToggleItem
								title="Google Analytics"
								checked={toggles.googleAnalytics}
								onChange={() => toggleSwitch("googleAnalytics")}
								small
							/>
							<ToggleItem
								title="Google Fonts"
								checked={toggles.googleFonts}
								onChange={() => toggleSwitch("googleFonts")}
								small
							/>
							<ToggleItem
								title="Google Maps"
								checked={toggles.googleMaps}
								onChange={() => toggleSwitch("googleMaps")}
								small
							/>
							<ToggleItem
								title="Google Tag Manager"
								checked={toggles.googleTagManager}
								onChange={() => toggleSwitch("googleTagManager")}
								small
							/>
							<ToggleItem
								title="reCAPTCHA"
								checked={toggles.reCaptcha}
								onChange={() => toggleSwitch("reCaptcha")}
								small
							/>
						</div>
					)}
				</div>

				{/* Footer Actions */}
				<div
					style={{
						padding: "1rem",
						borderTop: "1px solid #eee",
						display: "flex",
						gap: "1rem",
						flexWrap: "wrap",
					}}
				>
					<ActionButton onClick={onClose} variant="primary">
						Guardar configuración
					</ActionButton>
					<ActionButton onClick={onClose} variant="danger">
						Denegar
					</ActionButton>
					<ActionButton onClick={onClose} variant="danger" fill>
						Aceptar todo
					</ActionButton>
				</div>
			</div>
		</div>
	);
};

interface ToggleItemProps {
	readonly title: string;
	readonly description?: string;
	readonly checked: boolean;
	readonly onChange: () => void;
	readonly disabled?: boolean;
	readonly small?: boolean;
}

const ToggleItem = ({
	title,
	description,
	checked,
	onChange,
	disabled,
	small,
}: ToggleItemProps) => {
	const height = small ? "16px" : "20px";
	let dotLeft = "2px";
	if (checked) {
		dotLeft = small ? "18px" : "22px";
	}

	return (
		<div
			style={{
				border: "1px solid #eee",
				borderRadius: "8px",
				padding: small ? "0.75rem" : "1rem",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: description ? "0.5rem" : 0,
				}}
			>
				<span
					style={{
						fontWeight: "600",
						color: description ? "#4CAF50" : "#333",
						fontSize: small ? "0.9rem" : "1rem",
					}}
				>
					{title}
				</span>
				<button
					type="button"
					onClick={disabled ? undefined : onChange}
					aria-pressed={checked}
					disabled={disabled}
					style={{
						padding: 0,
						border: "none",
						width: small ? "32px" : "40px",
						height: height,
						backgroundColor: checked ? "#1A237E" : "#ccc",
						borderRadius: "10px",
						position: "relative",
						cursor: disabled ? "not-allowed" : "pointer",
						transition: "background-color 0.3s",
					}}
				>
					<div
						style={{
							width: small ? "12px" : "16px",
							height: small ? "12px" : "16px",
							backgroundColor: "#fff",
							borderRadius: "50%",
							position: "absolute",
							top: "2px",
							left: dotLeft,
							transition: "left 0.3s",
						}}
					/>
				</button>
			</div>
			{description && (
				<p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
					{description}
				</p>
			)}
		</div>
	);
};

interface ActionButtonProps {
	readonly children: React.ReactNode;
	readonly onClick: () => void;
	readonly variant: "primary" | "danger";
	readonly fill?: boolean;
}

const ActionButton = ({
	children,
	onClick,
	variant,
	fill,
}: ActionButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		style={{
			flex: 1,
			padding: "0.75rem",
			borderRadius: "4px",
			border: "none",
			fontWeight: "600",
			cursor: "pointer",
			backgroundColor: variant === "danger" ? "#4CAF50" : "#1A237E",
			color: "#fff",
			opacity: fill ? 1 : 0.9,
		}}
	>
		{children}
	</button>
);

export default PrivacyModal;
