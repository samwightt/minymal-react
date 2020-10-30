import { GetStaticProps } from "next";
import { PostOrPage, Settings } from "@tryghost/content-api";
import api from "config/clientConfig";
import Image from "next/image";

import ReactHtmlParser from "react-html-parser";

import Navbar from "components/Navbar";
import Header from "components/Header";
import Footer from "components/Footer";

interface HomeProps {
  page: PostOrPage;
  settings: Settings;
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <Navbar settings={props.settings} seo={{}} />
      <Header settings={props.settings} />
      <main>
        <div className="container max-w-2xl mx-auto py-32 px-4 md:px-0 ghost-content">
          <h1>{props.page.title}</h1>
          {ReactHtmlParser(props.page.html, {
            transform(node) {
              if (node.type === "tag" && node.name === "img") {
                return <Image unsized src={node.attribs.src} />;
              }
            },
          })}
        </div>
      </main>
      <Footer settings={props.settings} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const page = await api.pages.read({ slug: "home" });
  const settings = await api.settings.browse();

  return {
    props: {
      page,
      settings,
    },
    revalidate: 60,
  };
};
