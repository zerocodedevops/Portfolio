import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Footer from "@zerodelay/components/common/Footer";

describe("Footer Component", () => {
	it("renders company information", () => {
		render(
			<BrowserRouter>
				<Footer />
			</BrowserRouter>,
		);

		expect(screen.getByText("Zero Delay")).toBeInTheDocument();
		expect(
			screen.getByText(/Empresa de mudanzas en Madrid/i),
		).toBeInTheDocument();
	});

	it("renders contact information", () => {
		render(
			<BrowserRouter>
				<Footer />
			</BrowserRouter>,
		);

		expect(screen.getByText("91 123 45 67")).toBeInTheDocument();
		expect(screen.getByText("info@zerodelay.es")).toBeInTheDocument();
	});

	it("renders legal links", () => {
		render(
			<BrowserRouter>
				<Footer />
			</BrowserRouter>,
		);

		expect(screen.getByText("Aviso Legal")).toBeInTheDocument();
		expect(screen.getByText("Privacidad")).toBeInTheDocument();
		expect(screen.getByText("Cookies")).toBeInTheDocument();
	});
});
