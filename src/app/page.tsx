import CategoryGrid from "@/components/site/CategoryGrid";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import TopNavBar from "@/components/site/TopNavBar";
import TrustSection from "@/components/site/TrustSection";

export default function Home() {
  return (
    <>
      <TopNavBar />
      <main className="flex flex-1 flex-col pt-[88px]">
        <Hero />
        <CategoryGrid />
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}
