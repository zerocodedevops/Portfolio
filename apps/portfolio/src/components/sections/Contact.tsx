import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
	AlertCircle,
	ArrowUpRight,
	CheckCircle,
	Mail,
	Send,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { sileo } from "sileo";
import { z } from "zod";
import { RecaptchaV2, type RecaptchaV2Handle } from "@/components/RecaptchaV2";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { slideInLeft, slideInRight } from "@/hooks/useScrollAnimation";

export function Contact() {
	const { t } = useTranslation();
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");
	const [errorMessage, setErrorMessage] = useState("");
	const [fallbackMailto, setFallbackMailto] = useState(
		"mailto:admin@zerocode-devops.com",
	);
	const [captchaToken, setCaptchaToken] = useState("");
	const [captchaRequested, setCaptchaRequested] = useState(false);
	const captchaRef = useRef<RecaptchaV2Handle>(null);
	const captchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

	const handleCaptchaError = useCallback(() => {
		setErrorMessage(
			"No se pudo cargar la protección antispam. Puedes escribirme directamente por correo.",
		);
	}, []);

	const handleCaptchaTokenChange = useCallback((token: string) => {
		setCaptchaToken(token);
		if (token) setErrorMessage("");
	}, []);

	const contactSchema = useMemo(
		() =>
			z.object({
				name: z
					.string()
					.trim()
					.min(2, t("contact.form.validation.name"))
					.max(120),
				email: z
					.string()
					.trim()
					.max(254)
					.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
						message: t("contact.form.validation.email"),
					}),
				subject: z
					.string()
					.trim()
					.min(5, t("contact.form.validation.subject"))
					.max(120),
				message: z
					.string()
					.trim()
					.min(10, t("contact.form.validation.message"))
					.max(5000),
				companyWebsite: z.string().max(0).optional(),
			}),
		[t],
	);

	type ContactFormData = z.infer<typeof contactSchema>;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactSchema),
	});

	const onSubmit = async (data: ContactFormData) => {
		if (data.companyWebsite) return;
		if (!captchaSiteKey) {
			setErrorMessage(
				"El formulario está pendiente de configurar reCAPTCHA. Puedes escribirme directamente por correo.",
			);
			setStatus("error");
			return;
		}
		if (!captchaToken) {
			setCaptchaRequested(true);
			setErrorMessage(
				"La verificación de seguridad se está cargando. Complétala y vuelve a pulsar Enviar consulta.",
			);
			return;
		}

		setStatus("loading");
		setErrorMessage("");
		setFallbackMailto(
			`mailto:admin@zerocode-devops.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Nombre: ${data.name}\nCorreo: ${data.email}\n\n${data.message}`)}`,
		);

		try {
			const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
			const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
			const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

			if (!serviceId || !templateId || !publicKey) {
				const message = t("contact.form.notConfigured");
				setStatus("error");
				setErrorMessage(message);
				sileo.error({
					title: "Formulario no configurado",
					description: message,
				});
				return;
			}

			await emailjs.send(
				serviceId,
				templateId,
				{
					name: data.name,
					from_name: data.name,
					email: data.email,
					from_email: data.email,
					reply_to: data.email,
					subject: data.subject,
					message: data.message,
					"g-recaptcha-response": captchaToken,
				},
				publicKey,
			);

			sileo.success({
				title: "Consulta enviada",
				description: "En breve me pondré en contacto contigo.",
			});
			setStatus("success");
			reset();
			captchaRef.current?.reset();
		} catch {
			sileo.error({
				title: "Error al enviar el mensaje",
				description: t("contact.form.error"),
			});
			setStatus("error");
			setErrorMessage(t("contact.form.error"));
			captchaRef.current?.reset();
		}
	};

	const inputClass =
		"w-full rounded-xl border border-[#E2DFD7] bg-[#F7F6F3] px-4 py-3.5 text-[#111111] placeholder:text-[#5C5B57]/70 transition-colors focus:border-[#0077CC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0077CC]/20";

	return (
		<section
			id="contacto"
			className="relative isolate overflow-hidden border-b border-[#E2DFD7] bg-[#F7F6F3] py-20 text-[#111111] sm:py-28"
		>
			<div className="container-custom relative z-10">
				<div className="mb-12 border-b border-[#E2DFD7] pb-6">
					<p className="font-tech mb-3 text-xs font-medium uppercase tracking-widest text-[#0077CC]">
						07 / CONTACTO
					</p>
					<h2 className="text-[clamp(2rem,3.5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-[#111111]">
						Hablemos de tu proyecto.
					</h2>
					<p className="mt-4 max-w-[58ch] text-base leading-relaxed text-[#5C5B57]">
						Tanto si necesitas lanzar la web de tu negocio como si buscas
						desarrollar una aplicación a medida, cuéntame qué necesitas.
					</p>
				</div>

				<div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
					<motion.div
						variants={slideInLeft}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="h-full"
					>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="h-full rounded-2xl border border-[#E2DFD7] bg-white p-6 sm:p-8"
						>
							<div className="mb-6 border-b border-[#E2DFD7] pb-5">
								<p className="font-tech mb-2 text-[11px] font-medium uppercase tracking-widest text-[#0077CC]">
									SOLICITAR PROPUESTA
								</p>
								<h3 className="text-2xl font-semibold tracking-tight text-[#111111] sm:text-3xl">
									Cuéntame qué tienes en mente
								</h3>
								<p className="mt-2 text-sm leading-6 text-[#5C5B57]">
									Respuesta directa sin compromiso. Tus datos se utilizan
									únicamente para atender tu solicitud.
								</p>
							</div>

							<div className="space-y-4">
								<div className="sr-only" aria-hidden="true">
									<label htmlFor="companyWebsite">Deja este campo vacío</label>
									<input
										id="companyWebsite"
										tabIndex={-1}
										autoComplete="off"
										{...register("companyWebsite")}
									/>
								</div>

								<div className="flex flex-col">
									<label
										htmlFor="name"
										className="mb-2 text-sm font-semibold text-[#111111]"
									>
										{t("contact.form.name")}
									</label>
									<input
										id="name"
										type="text"
										className={inputClass}
										placeholder={t("contact.form.placeholders.name")}
										maxLength={120}
										{...register("name")}
										aria-invalid={errors.name ? "true" : "false"}
										aria-describedby={errors.name ? "name-error" : undefined}
										required
									/>
									{errors.name && (
										<p
											id="name-error"
											className="mt-2 text-sm font-medium text-red-700"
											role="alert"
										>
											{errors.name.message}
										</p>
									)}
								</div>

								<div className="flex flex-col">
									<label
										htmlFor="email"
										className="mb-2 text-sm font-semibold text-[#111111]"
									>
										{t("contact.form.email")}
									</label>
									<input
										id="email"
										type="email"
										className={inputClass}
										placeholder={t("contact.form.placeholders.email")}
										maxLength={254}
										{...register("email")}
										aria-invalid={errors.email ? "true" : "false"}
										aria-describedby={errors.email ? "email-error" : undefined}
										required
									/>
									{errors.email && (
										<p
											id="email-error"
											className="mt-2 text-sm font-medium text-red-700"
											role="alert"
										>
											{errors.email.message}
										</p>
									)}
								</div>

								<div className="flex flex-col">
									<label
										htmlFor="subject"
										className="mb-2 text-sm font-semibold text-[#111111]"
									>
										{t("contact.form.subject")}
									</label>
									<input
										id="subject"
										type="text"
										className={inputClass}
										placeholder={t("contact.form.placeholders.subject")}
										maxLength={120}
										{...register("subject")}
										aria-invalid={errors.subject ? "true" : "false"}
										aria-describedby={
											errors.subject ? "subject-error" : undefined
										}
										required
									/>
									{errors.subject && (
										<p
											id="subject-error"
											className="mt-2 text-sm font-medium text-red-700"
											role="alert"
										>
											{errors.subject.message}
										</p>
									)}
								</div>

								<div className="flex flex-col">
									<label
										htmlFor="message"
										className="mb-2 text-sm font-semibold text-[#111111]"
									>
										{t("contact.form.message")}
									</label>
									<textarea
										id="message"
										className={inputClass}
										placeholder={t("contact.form.placeholders.message")}
										rows={3}
										maxLength={5000}
										{...register("message")}
										aria-invalid={errors.message ? "true" : "false"}
										aria-describedby={
											errors.message ? "message-error" : undefined
										}
										required
									/>
									{errors.message && (
										<p
											id="message-error"
											className="mt-2 text-sm font-medium text-red-700"
											role="alert"
										>
											{errors.message.message}
										</p>
									)}
								</div>

								{captchaSiteKey && captchaRequested ? (
									<RecaptchaV2
										ref={captchaRef}
										siteKey={captchaSiteKey}
										onTokenChange={handleCaptchaTokenChange}
										onError={handleCaptchaError}
									/>
								) : !captchaSiteKey ? (
									<div
										className="space-y-1 rounded-xl border border-[#0077CC]/30 bg-[#EFECE6] p-3 text-sm text-[#111111]"
										role="status"
									>
										<p>La protección antispam aún no está configurada.</p>
										<p>Puedes contactar por correo o WhatsApp.</p>
									</div>
								) : (
									<p className="text-xs text-[#5C5B57]">
										La verificación de seguridad se carga cuando intentas enviar
										el formulario.
									</p>
								)}

								<button
									type="submit"
									disabled={!captchaSiteKey || status === "loading"}
									className="mt-4 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-6 text-xs font-medium uppercase tracking-widest text-[#F7F6F3] transition-colors hover:bg-[#0077CC] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC] disabled:cursor-not-allowed disabled:opacity-50"
								>
									<span>
										{status === "loading"
											? t("contact.form.sending")
											: "Enviar consulta"}
									</span>
									<Send className="h-4 w-4" aria-hidden="true" />
								</button>

								<div className="space-y-1 pt-2 text-xs leading-5 text-[#5C5B57]">
									<p>Responsable: David G. (ZeroCode DevOps).</p>
									<p>
										<a
											className="font-semibold text-[#111111] underline underline-offset-2 hover:text-[#0077CC]"
											href="/politica-de-privacidad"
										>
											Privacidad y derechos
										</a>
										.
									</p>
								</div>

								<AnimatePresence mode="wait">
									{status === "success" && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											role="status"
											className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-900"
										>
											<CheckCircle className="h-5 w-5 shrink-0" />
											<p className="text-sm font-medium">
												{t("contact.form.success")}
											</p>
										</motion.div>
									)}

									{status === "error" && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											role="alert"
											className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-900"
										>
											<AlertCircle className="h-5 w-5 shrink-0" />
											<div className="text-sm font-medium">
												<div className="space-y-1">
													{errorMessage.split(/(?<=\.)\s+/).map((sentence) => (
														<p key={sentence}>{sentence}</p>
													))}
												</div>
												<a
													className="mt-2 inline-block underline underline-offset-2"
													href={fallbackMailto}
												>
													Escríbeme directamente por correo
												</a>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</form>
					</motion.div>

					<motion.div
						variants={slideInRight}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="self-start lg:sticky lg:top-24"
					>
						<div className="rounded-2xl border border-white/10 bg-[#09090B] p-6 text-[#F7F6F3] sm:p-8">
							<p className="font-tech mb-3 text-[11px] font-medium uppercase tracking-widest text-[#0077CC]">
								CONTACTO DIRECTO
							</p>
							<h4 className="mb-3 text-2xl font-semibold tracking-tight text-[#F7F6F3]">
								¿Prefieres una conversación rápida?
							</h4>
							<p className="mb-7 text-sm leading-relaxed text-white/70">
								Escríbeme directamente por correo electrónico o WhatsApp.
							</p>
							<div className="space-y-3.5">
								<a
									href="mailto:admin@zerocode-devops.com"
									className="group flex min-w-0 items-center gap-4 rounded-xl border border-white/12 bg-[#141418] p-4 transition-colors hover:border-[#0077CC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
								>
									<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0077CC]/15 text-[#0077CC] transition-colors group-hover:bg-[#0077CC] group-hover:text-white">
										<Mail className="h-5 w-5" aria-hidden="true" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="font-tech mb-0.5 text-[10px] uppercase tracking-widest text-white/55">
											Email
										</p>
										<p className="break-words text-sm font-semibold text-[#F7F6F3] sm:text-base">
											admin@zerocode-devops.com
										</p>
									</div>
									<ArrowUpRight
										className="h-4 w-4 shrink-0 text-white/50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0077CC]"
										aria-hidden="true"
									/>
								</a>

								<a
									href="https://wa.me/34912622712"
									target="_blank"
									rel="noopener noreferrer"
									className="group flex min-w-0 items-center gap-4 rounded-xl border border-white/12 bg-[#141418] p-4 transition-colors hover:border-[#0077CC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077CC]"
								>
									<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0077CC]/15 text-[#0077CC] transition-colors group-hover:bg-[#0077CC] group-hover:text-white">
										<WhatsAppIcon className="h-5 w-5" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="font-tech mb-0.5 text-[10px] uppercase tracking-widest text-white/55">
											WhatsApp
										</p>
										<p className="text-sm font-semibold text-[#F7F6F3] sm:text-base">
											Enviar un mensaje
										</p>
									</div>
									<ArrowUpRight
										className="h-4 w-4 shrink-0 text-white/50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0077CC]"
										aria-hidden="true"
									/>
								</a>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
