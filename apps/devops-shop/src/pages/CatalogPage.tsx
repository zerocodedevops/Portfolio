import { Filter, Mic, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "../components/ProductCard";
import {
	useGetCategoriesQuery,
	useGetProductsQuery,
} from "../services/productsApi";

interface SpeechRecognitionEvent extends Event {
	results: {
		[index: number]: {
			[index: number]: {
				transcript: string;
			};
		};
	};
}

interface SpeechRecognition extends EventTarget {
	lang: string;
	start(): void;
	onresult: (event: SpeechRecognitionEvent) => void;
	onerror: () => void;
	onend: () => void;
}

const SKELETON_IDS = [
	"skel-a",
	"skel-b",
	"skel-c",
	"skel-d",
	"skel-e",
	"skel-f",
	"skel-g",
	"skel-h",
] as const;


export default function CatalogPage() {
	const { t } = useTranslation();
	const { data: products, isLoading } = useGetProductsQuery();
	const { data: categories } = useGetCategoriesQuery();
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isListening, setIsListening] = useState(false);

	const handleVoiceSearch = () => {
		const SpeechRecognition =
			(
				globalThis as typeof globalThis & {
					SpeechRecognition?: new () => SpeechRecognition;
					webkitSpeechRecognition?: new () => SpeechRecognition;
				}
			).SpeechRecognition ||
			(
				globalThis as typeof globalThis & {
					SpeechRecognition?: new () => SpeechRecognition;
					webkitSpeechRecognition?: new () => SpeechRecognition;
				}
			).webkitSpeechRecognition;

		if (SpeechRecognition) {
			const recognition = new SpeechRecognition();
			recognition.lang = "es-ES";
			recognition.start();
			setIsListening(true);

			recognition.onresult = (event) => {
				const transcript = event.results[0][0].transcript;
				setSearch(transcript);
				setIsListening(false);
			};

			recognition.onerror = () => setIsListening(false);
			recognition.onend = () => setIsListening(false);
		} else {
			alert("Tu navegador no soporta búsqueda por voz");
		}
	};

	const filteredProducts = products?.filter((product) => {
		const matchesSearch = product.title
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesCategory =
			selectedCategory === "all" || product.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="space-y-8">
			{/* Header & Filters */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 dark:text-white">
						{t("catalog.title")}
					</h1>
					<p className="text-slate-500 dark:text-slate-400 mt-1">
						{t("catalog.subtitle")}
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<input
							type="text"
							placeholder={
								isListening ? t("catalog.voiceSearch") : t("catalog.search")
							}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className={`pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border ${isListening ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-700"} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-all dark:text-white dark:placeholder-slate-500`}
						/>
						<button
							type="button"
							onClick={handleVoiceSearch}
							className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 transition-colors ${isListening ? "text-red-500 animate-pulse" : "text-slate-400"}`}
							title="Buscar por voz"
						>
							<Mic className="w-4 h-4" />
						</button>
					</div>

					<div className="relative">
						<Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer capitalize w-full sm:w-48 dark:text-white"
						>
							<option value="all">{t("catalog.category.all")}</option>
							{categories?.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Grid */}
			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{SKELETON_IDS.map((id) => (
						<div
							key={id}
							className="bg-white dark:bg-slate-900 rounded-2xl p-4 h-[400px] animate-pulse border border-slate-100 dark:border-slate-800"
						>
							<div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4" />
							<div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4 mb-2" />
							<div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4 mb-4" />
							<div className="mt-auto pt-4 flex justify-between">
								<div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
								<div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-8" />
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{filteredProducts?.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}

					{filteredProducts?.length === 0 && (
						<div className="col-span-full py-20 text-center text-slate-400">
							{t("catalog.noResults")}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
