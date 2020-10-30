import { GetStaticProps } from "next";
import { PostsOrPages, Settings } from "@tryghost/content-api";
import api from "config/clientConfig";
import Image from "next/image";

import ReactHtmlParser from "react-html-parser";

import Navbar from "components/Navbar";
import Footer from "components/Footer";

interface BlogProps {
  posts: PostsOrPages;
  settings: Settings;
}

export default function Blog(props: BlogProps) {
  return (
    <div>
      <Navbar settings={props.settings} />
      <div className="py-32 gradient-header">
        <div className="container mx-auto max-w-md flex flex-col items-center">
          <h1 className="mt-8 text-2xl text-gray-900 uppercase font-extrabold font-open text-center">
            Blog
          </h1>
          <h2 className="mt-1 text-center leading-normal font-light text-gray-600">
            Thoughts, ideas, opinions.
          </h2>
        </div>
      </div>
      <main className="container max-w-2xl mx-auto py-32 px-4 md:px-0">
        {props.posts.map((post) => (
          <div className="my-24">
            <article className="max-h-post relative">
              <header>
                <h2 className="text-3xl font-bold text-black hover:text-blue-600 transition duration-200 mb-2">
                  {post.title}
                </h2>
                <time
                  className="font-semibold text-gray-800"
                  dateTime={post.published_at}
                >
                  {new Date(post.published_at).toLocaleString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <p className="text-gray-600">
                  {post.reading_time} minute{post.reading_time > 1 && "s"}
                </p>
              </header>
              <section className="ghost-content">
                {ReactHtmlParser(post.html, {
                  transform(node) {
                    if (node.type === "tag" && node.name === "img") {
                      return <Image unsized src={node.attribs.src} />;
                    }
                  },
                })}
              </section>
              <div className="fade-out">&nbsp;</div>
            </article>
            <a className="font-semibold text-gray-700 border-b-2 pb-1 border-gray-500 hover:text-blue-600 hover:border-blue-700 transition duration-200 -mt-4">
              Continue reading
            </a>
          </div>
        ))}
      </main>
      <Footer settings={props.settings} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const posts = await api.posts.browse({ page: 1, limit: 20 });
  const settings = await api.settings.browse();

  return {
    props: {
      posts,
      settings,
    },
    revalidate: 60,
  };
};
