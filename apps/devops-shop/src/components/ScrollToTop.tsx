import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
	useLocation();

	useEffect(() => {
		globalThis.scrollTo(0, 0);
	}, []);

	return null;
}
