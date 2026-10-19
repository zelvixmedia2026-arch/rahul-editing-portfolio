import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/Work";
import About from "./components/About";
import Creator from "./components/Creator";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="work-page">
        <Hero />
        <Work />
        <About />
        <Creator />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}