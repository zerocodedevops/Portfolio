import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import WhyChooseUs from '../components/home/WhyChooseUs';
import BudgetCalculator from '../components/home/BudgetCalculator';
import TrustBar from '../components/home/TrustBar';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';

const Home = () => {
    return (
        <div>
            <SEO
                title="Zero Delay Mudanzas | Mudanzas Profesionales en Madrid"
                description="Mudanzas profesionales de hogar y oficina en Madrid. Guardamuebles, grupajes y mudanzas internacionales con todas las garantías."
            />
            <Hero />
            <TrustBar />
            <Services />
            <WhyChooseUs />
            <BudgetCalculator />
            <Testimonials />
            <CTASection />
        </div>
    );
};

export default Home;
