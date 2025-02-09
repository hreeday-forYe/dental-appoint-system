import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import loginImage from "../assets/images/login.png";
import { Link, NavLink } from "react-router-dom";
import { About, CallToActionDentist } from "@/components";
import gallery1 from "../assets/images/gallery/gallery1.png";
import gallery2 from "../assets/images/gallery/gallery2.png";
import gallery3 from "../assets/images/gallery/gallery3.jpg";
import gallery4 from "../assets/images/gallery/gallery4.png";
import gallery5 from "../assets/images/gallery/gallery5.jpg";
import gallery6 from "../assets/images/gallery/gallery6.png";
import gallery7 from "../assets/images/gallery/gallery7.png";
import { useEffect } from "react";
export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container py-2 px-5 md:px-12 mb-5 md:py-16  mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
            <img
              alt="feature"
              className="object-cover object-center max-h-[610px] h-auto w-full"
              src={loginImage}
              width={400}
              height={300}
            />
          </div>

          {/* Right side */}
          <div className="flex flex-col items-center flex-wrap lg:py-6 -mb-10 lg:w-1/2 lg:pl-12 lg:text-left text-center">
            <div className="flex flex-col mb-10 lg:gap-7 gap-2 text-justify">
              <h1 className="text-5xl font-semibold">Our Mission</h1>
              <p>
                At Northern Heights Dental, people come first. We help each of
                our patients to achieve optimal wellness and health by using a
                whole body approach to oral health. This means not just focusing
                on cavities, but focusing on; cranio-facial development, bite
                and joint balance, oral flora, proper muscle balance function,
                and bio-compatibility of dental materials. Great care and
                planning ensure that everything we do helps promote overall
                health and well being.
              </p>

              <div className="flex flex-col gap-3 mt-3 tracking-tight">
                <h3 className="text-2xl md:text-3xl">
                  More than anything else we love creating happy, healthy
                  smiles.
                </h3>
                <p>
                  We work hard to stay up to date with the most advanced
                  techniques and technologies to ensure that our patients
                  receive the best care possible. Our office utilizes 3D CBCT
                  radiographs to allow for guided surgical and endodontic
                  protocols. This enables these procedures to performed
                  digitally before they are performed surgically to ensure
                  optimal results. 3D imaging also is utilized for the analysis
                  of airway growth and development. We also use the best 3D
                  optical scanner for all of our dental restoration and
                  Invisalign impressions. Dr Williams is a strong advocate for
                  using microsurgical techniques, this means less discomfort and
                  faster healing times.
                </p>
              </div>
              <div className="flex items-center justify-center mt-3 md:justify-start">
                <NavLink to={"/new-appointment"}>
                  <Button className="bg-mainCustomColor hover:bg-teal-600">
                    Book Appointment
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
          <About />

          {/* Another section gallery */}
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto flex flex-wrap">
              <div className="flex flex-col text-center w-full mb-20">
                <h2 className="text-center text-4xl font-bold text-black ">
                  Gallery
                </h2>
                <p className="lg:w-2/3 mx-auto text-justify leading-relaxed text-base pt-4">
                  Our team is committed to caring for your smile with the latest
                  advancements in dental technology. By using state-of-the-art
                  tools like 3D imaging, digital scanners, and minimally
                  invasive techniques, we ensure precise, effective, and
                  comfortable treatments.
                </p>
              </div>
              <div className="flex flex-wrap md:-m-2 -m-1">
                <div className="flex flex-wrap w-1/2">
                  <div className="md:p-2 p-1 w-1/2">
                    <img
                      alt="gallery"
                      className="w-full object-cover h-full object-center block"
                      src={gallery1}
                    />
                  </div>
                  <div className="md:p-2 p-1 w-1/2">
                    <img
                      alt="gallery"
                      className="w-full object-cover h-full object-center block"
                      src={gallery3}
                    />
                  </div>
                  <div className="md:p-2 p-1 w-full">
                    <img
                      alt="gallery"
                      className="w-full h-full object-cover object-center block"
                      src={gallery5}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap w-1/2">
                  <div className="md:p-2 p-1 w-full">
                    <img
                      alt="gallery"
                      className="w-full h-full object-cover object-center block"
                      src={gallery4}
                    />
                  </div>
                  <div className="md:p-2 p-1 w-1/2">
                    <img
                      alt="gallery"
                      className="w-full object-cover h-full object-center block"
                      src={gallery7}
                    />
                  </div>
                  <div className="md:p-2 p-1 w-1/2">
                    <img
                      alt="gallery"
                      className="w-full object-cover h-full object-center block"
                      src={gallery6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <CallToActionDentist />
      </section>
    </>
  );
}
