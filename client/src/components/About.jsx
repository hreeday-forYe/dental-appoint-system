import React from "react";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Harry Mathew",
      role: "UI Developer",
      description:
        "DIY tote bag drinking vinegar cronut adaptogen squid fannypack vaporware.",
      image:
        "https://cdn.pixabay.com/photo/2023/12/15/18/32/ai-generated-8451270_1280.png",
    },
    {
      name: "Dr. Sarah Tancredi",
      role: "UI Developer",
      description:
        "DIY tote bag drinking vinegar cronut adaptogen squid fannypack vaporware.",
      image:
        "https://cdn.pixabay.com/photo/2024/02/16/21/37/ai-generated-8578393_1280.png",
    },
    {
      name: "Dr. Saurav Tiwari",
      role: "UI Developer",
      description:
        "DIY tote bag drinking vinegar cronut adaptogen squid fannypack vaporware.",
      image:
        "https://images.unsplash.com/photo-1667133295308-9ef24f71952e?q=80&w=1957&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Dr. Sumit Pandey",
      role: "UI Developer",
      description:
        "DIY tote bag drinking vinegar cronut adaptogen squid fannypack vaporware.",
      image:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <section>
      <div className="container px-5 py-12">
        <div className="flex flex-col text-center w-full mb-20">
          <h2 className="text-center text-4xl font-bold text-black ">
            Our Team
          </h2>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base pt-4">
            Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical
            gentrify, subway tile poke farm-to-table. Franzen you probably
            haven't heard of them.
          </p>
        </div>
        <div className="flex flex-wrap -m-4 pl-8">
          {teamMembers.map((item, index) => (
            <div className="p-4 lg:w-1/2" key={index}>
              <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
                <img
                  alt="team"
                  className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
                  src={item.image}
                />
                <div className="flex-grow sm:pl-8">
                  <h2 className="title-font font-medium text-lg text-gray-900">
                    {item.name}
                  </h2>
                  <h3 className="text-gray-500 mb-3">{item.role}</h3>
                  <p className="mb-4">{item.description}</p>
                  <span className="inline-flex ">
                    <a className="hover:text-teal-500 cursor-pointer">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    </a>
                    <a className="ml-2 hover:text-teal-500 cursor-pointer">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                    </a>
                    <a className="ml-2 hover:text-teal-500 cursor-pointer">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                      </svg>
                    </a>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
