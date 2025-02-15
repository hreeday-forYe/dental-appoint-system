import React from "react";
import {
  DentalHero,
  Testimonials,
  Container,
  Features,
  About,
  Contact,
  CallToAction,
  CallToActionDentist,
  FAQ,
} from "../components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const userdata = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    if (userdata && userdata.role === "admin") {
      navigate("/admin");
    } else if (userdata && userdata.role === "dentist") {
      navigate("/dentist");
    }
  }, [userdata, navigate]);

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
