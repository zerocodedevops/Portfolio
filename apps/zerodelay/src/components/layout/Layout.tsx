import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";
import SubFooter from "../common/SubFooter";
import WhatsAppButton from "../common/WhatsAppButton";

const Layout = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				backgroundColor: "#FFFFFF",
				color: "#333333",
				fontFamily: "'Poppins', sans-serif",
			}}
		>
			<Header />
			<main style={{ flex: 1 }}>
				<Outlet />
			</main>
			<Footer />
			<SubFooter />
			<WhatsAppButton />
		</div>
	);
};

export default Layout;
