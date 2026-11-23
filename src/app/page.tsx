import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Works from "@/components/Works";
import Practice from "@/components/Practice";
import Motion from "@/components/Motion";
import { Reel, Manifesto, Featured, Process, Studio, Contact, Footer } from "@/components/Sections";

export default function Page() {
  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <main id="main">
        <Hero />
        <Reel />
        <Manifesto />
        <Works />
        <Featured />
        <Practice />
        <Process />
        <Studio />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
