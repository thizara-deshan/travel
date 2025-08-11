import Image from "next/image";
import Dotsvg from "./ui/dotsvg";
import { Button } from "./ui/button";
import Link from "next/link";

function AboutUs() {
  return (
    <>
      <section
        id="about"
        className="overflow-hidden pt-2 pb-12 lg:pt-[40px] lg:pb-[90px] bg-white "
      >
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between -mx-4">
            <div className="w-full px-4 lg:w-6/12">
              <div className="flex items-center -mx-3 sm:-mx-4">
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="py-3 sm:py-4">
                    <Image
                      src="/sigiriya.webp"
                      alt="image of Sigiriya Rock Fortress"
                      className="w-full rounded-2xl"
                      width={1920}
                      height={1080}
                      quality={75}
                    />
                  </div>
                  <div className="py-3 sm:py-4">
                    <Image
                      src="/asset4.webp"
                      alt="Sri lanka deer with big antlers"
                      className="w-full rounded-2xl"
                      width={1920}
                      height={1080}
                      quality={75}
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="relative z-10 my-4">
                    <Image
                      src="/asset3.webp"
                      alt="guy enjoying beach on top of palm tree in sri lanka"
                      className="w-full rounded-2xl"
                      width={1920}
                      height={1080}
                      quality={75}
                    />
                    <Dotsvg />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="mt-10 lg:mt-0">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                  Welcome to{" "}
                  <span className="text-blue-800">
                    BlueLanka Travels & Tours{" "}
                  </span>
                </h2>
                <h3 className="block mb-4 text-lg font-semibold text-gray-800">
                  Your Gateway to the Wonders of Sri Lanka!
                </h3>
                <p className="mb-5 text-base text-gray-700 dark:text-dark-6 leading-relaxed">
                  we believe that travel is more than just a journey, it’s an
                  experience that enriches the soul, broadens the mind, and
                  creates memories that last a lifetime. As a leading travel
                  agency based in the heart of Sri Lanka, we are passionate
                  about sharing the beauty, culture, and heritage of our island
                  paradise with travelers from all corners of the globe
                </p>
                <p className="mb-8 text-base text-gray-700 dark:text-dark-6 leading-relaxed">
                  Founded by a team of passionate travel enthusiasts, Travels &
                  Tours has been crafting unforgettable travel experiences for
                  over 3 Years. Our deep-rooted knowledge of Sri Lanka, coupled
                  with our commitment to excellence, allows us to offer
                  personalized travel services that cater to the unique needs
                  and desires of each traveler.
                </p>
              </div>
              <Link href="/destinations">
                <Button className="text-white bg-blue-700 hover:bg-blue-900">
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutUs;
