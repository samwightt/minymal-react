import { FC } from "react";
import { Settings } from "@tryghost/content-api";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";

interface NavbarProps {
  settings: Settings;
}

const Navbar: FC<NavbarProps> = (props) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{props.settings.title}</title>
      </Head>
      <nav className="flex space-x-4 flex-row px-8 py-3 md:px-16 bg-white justify-between items-center">
        <Link href="/">
          <a className="group flex flex-row items-center space-x-2 transition duration-100">
            <Image
              src={props.settings.icon}
              className="rounded-full shadow-md transition duration-200 opacity-75 group-hover:opacity-100"
              width={35}
              height={35}
            />
            <h1 className="uppercase font-extrabold text-sm text-gray-600 group-hover:text-black transition duration-200">
              {props.settings.title}
            </h1>
          </a>
        </Link>
        <div className="flex flex-row space-x-1 items-center">
          {props.settings.navigation.map((item, index) => (
            <Link href={item.url} key={index}>
              <a
                className={`text-sm py-2 px-3 rounded-md transition duration-300 ${
                  router.pathname === item.url
                    ? "bg-black text-white hover:bg-gray-800 hover:text-white"
                    : "text-black hover:text-black hover:bg-gray-300"
                }`}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
