import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const FAQItems = [
    {
      id: crypto.randomUUID(),
      question: "How do I book a dental appointment?",
      answer:
        "You can book an appointment through our website by selecting your preferred date and time or by calling our clinic directly.",
    },
    {
      id: crypto.randomUUID(),
      question: "Can I reschedule or cancel my appointment?",
      answer:
        "Yes, you can reschedule or cancel your appointment by logging into your account or contacting us at least 24 hours in advance.",
    },
    {
      id: crypto.randomUUID(),
      question: "Do I need to bring anything for my first appointment?",
      answer:
        "Please bring a valid ID, any previous dental records, and your insurance details if applicable.",
    },
    {
      id: crypto.randomUUID(),
      question: "What payment methods do you accept?",
      answer:
        "We accept cash, credit/debit cards, and most dental insurance plans.",
    },
    {
      id: crypto.randomUUID(),
      question: "How early should I arrive for my appointment?",
      answer:
        "We recommend arriving at least 10 minutes early to complete any necessary paperwork.",
    },
    {
      id: crypto.randomUUID(),
      question: "Do you offer emergency dental services?",
      answer:
        "Yes, we provide emergency dental care. If you are experiencing severe pain or a dental emergency, please contact us immediately.",
    },
    {
      id: crypto.randomUUID(),
      question: "Is there a consultation fee for new patients?",
      answer:
        "The consultation fee varies based on the type of service and doctors. Please check our website or call us for details.",
    },
  ];
  return (
    <section className="mt-12 border-t p-12">
      <div className="w-3/5 mx-auto mb-12">
        <h2 className="text-center text-3xl font-bold">
          Frequently asked questions
        </h2>
      </div>
      <div className="lg:w-[60%] mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {FAQItems.map((faq) => (
            <div key={faq.id} className="lg:p-3 p-1 border m-2">
              <AccordionItem value={`item-${faq.id}`} className="border-none">
                <AccordionTrigger className="text-base text-left md:text-center md:text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
