import Image from "next/image";
import Link from "next/link";

function HomePage() {
  return (
    <>
      <div className="container mx-auto px-1 py-12 md:py-2">
        <div className="grid grid-cols-1  lg:grid-cols-2 items-center">
          <div className="md:order-1 order-2 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
                Discover the Unseen Beauty of{" "}
                <span className="bg-[url('/sri-lanka2.png')] bg-cover bg-center bg-clip-text text-fill-transparent ">
                  Sri Lanka
                </span>
              </h1>
              <h3 className="px-4 mt-6 text-lg leading-8 text-gray-600">
                From the golden beaches to the misty mountains, experience the
                heart of Sri Lanka with personalized tours that create
                unforgettable memories. register now and book your dream
                vacation with us!
              </h3>
              <div className="mt-10 flex drop-shadow-lg items-center tex-sm justify-center gap-6">
                <Link
                  href="/tour-packages"
                  className="rounded-2xl bg-blue-600 px-3.5 py-2.5  font-semibold text-white drop-shadow-lg hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  data-aos="fade-up"
                  data-aos-delay="700"
                >
                  Tour Packages
                </Link>
                <Link
                  href="/register"
                  className="rounded-2xl border border-blue-500 px-3 py-2  font-semibold leading-6 text-gray-900"
                >
                  Register{" "}
                  <span aria-hidden="true" className="text-blue-700">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:md:order-2 order-1 sm:w-full h-auto relative  overflow-hidden rounded-xl">
            <Image
              src="/hero-small-3.png"
              alt="Beautiful Sri Lanka landscape showcasing beaches and mountains - BlueLanka Travels"
              height={1920}
              width={1080}
              className="object-cover"
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
