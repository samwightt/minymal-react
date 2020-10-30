import { GetStaticPaths, GetStaticProps } from "next";
import api from "config/clientConfig";
import { PostOrPage, Settings } from "@tryghost/content-api";
import { useRouter } from "next/router";

import Navbar from "components/Navbar";
import Footer from "components/Footer";

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
        <h1>{props.post.title}</h1>
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
