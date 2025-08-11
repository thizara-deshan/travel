import { whyChooseUs } from "../lib/whyChooseUs";

import React from "react";

function WhyChooseUs() {
  return (
    <section className="bg-white dark:bg-gray-900 container mx-auto">
      <div className="py-8 px-2 mx-auto  sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Why Choose <span className=" text-blue-800">Us</span>
          </h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">
            We are the best in the industry, with years of experience in
            providing the best tours and packages for our customers.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {whyChooseUs.map((item) => (
            <div key={item.id} data-aos="flip-up">
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-100 lg:h-12 lg:w-12 ">
                <item.icon />
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
