import { Suspense, lazy } from "react";
import testimonial1 from "../assets/images/testimonials/testimonial1.jpg";
import testimonial2 from "../assets/images/testimonials/testimonial2.jpg";
import testimonial3 from "../assets/images/testimonials/testimonial3.jpg";
import testimonial4 from "../assets/images/testimonials/testimonial4.jpg";
import testimonial5 from "../assets/images/testimonials/testimonial5.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: testimonial1,
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: testimonial2,
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: testimonial3,
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: testimonial4,
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: testimonial5,
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Mary Jane",
      designation: "CTO at Cedar Gate",
      src: testimonial5,
    },
  ];
  return (
    <section className="mt-11">
      <div className="w-3/5 mx-auto">
        <h2 className="text-center text-3xl font-bold">What our Clients Say</h2>
        <p className="text-center text-sm lg:text-lg pt-4 text-gray-700">
          Our finest materials and unique expertise have brought countless
          smiles, delivering unmatched quality and happiness to our valued
          customers.
        </p>
      </div>

      <div className="w-[80%] mx-auto">
        <Carousel className=" w-full">
          <CarouselContent>
            {testimonials &&
              testimonials.map((item, index) => (
                <CarouselItem className="lg:basis-1/2 border-r-2" key={index}>
                  <div className="grid items-center justify-center p-6">
                    <div className="grid gap-3 lg:gap-5">
                      <p className="text-base lg:text-base text-gray-700 font-normal italic">
                        &ldquo;{item.quote}&ldquo;
                      </p>
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full overflow-hidden w-10 h-10">
                          <img
                            src={item.src}
                            width="40"
                            height="40"
                            alt="Profile"
                            className="object-cover w-full h-full"
                            style={{ aspectRatio: "40/40", objectFit: "cover" }}
                          />
                        </div>
                        <div className="text-sm font-semibold">
                          <div>{item.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.designation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
