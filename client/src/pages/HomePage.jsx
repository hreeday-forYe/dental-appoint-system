import React from "react";
import {
  DentalHero,
  Testimonials,
  Container,
  Features,
  About,
  Contact,
  CallToAction,
  FAQ,
} from "../components";

const HomePage = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <DentalHero />
      <Features />
      <About />
      <Testimonials />
      <FAQ />
      <CallToAction />
      <Contact />
      <Container></Container>
    </>
  );
};

export default HomePage;
