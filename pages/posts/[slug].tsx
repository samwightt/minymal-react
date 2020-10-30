import { GetStaticPaths, GetStaticProps } from "next";
import api from "config/clientConfig";
import { PostOrPage, Settings } from "@tryghost/content-api";
import { useRouter } from "next/router";

import Navbar from "components/Navbar";
import Footer from "components/Footer";

import ReactHtmlParser from "react-html-parser";
import Image from "next/image";

interface PostSlugProps {
  post: PostOrPage;
  settings: Settings;
}

export default function PostSlug(props: PostSlugProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  } else
    return (
      <div>
        <Navbar
          settings={props.settings}
          seo={{
            title: props.post.title,
            description: props.post.meta_description,
          }}
        />
        <main className="container max-w-2xl mx-auto py-32 px-4 md:px-0">
          <h1 className="font-extrabold text-4xl mb-2 leading-tight">
            {props.post.title}
          </h1>
          <time
            className="text-lg font-semibold text-gray-800"
            dateTime={props.post.published_at}
          >
            {new Date(props.post.published_at).toLocaleString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <p className="text-gray-600">{props.post.reading_time} minutes</p>
          <div className="ghost-content">
            {ReactHtmlParser(props.post.html, {
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await api.posts.read({ slug: params.slug as string });
  const settings = await api.settings.browse();

  return {
    props: {
      post,
      settings,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await api.posts.browse({ limit: 500, page: 1 });
  if (posts)
    return {
      paths: posts.map((post) => ({ params: { slug: post.slug } })),
      fallback: true,
    };
};
