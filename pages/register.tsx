import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.req.cookies.user)
    return {
      redirect: {
        destination: `/${context.query?.source || ""}`,
        permanent: false,
      },
    };
  const source: string | null = (context.query.source as string) ?? null;
  return {
    props: {
      source,
    },
  };
};

const Register: NextPage = ({
  source,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <form method="post" action="/api/register">
      <input type="text" name="name" />
      <input type="hidden" name="source" value={source} />
      <button type="submit">Let&apos;s go!</button>
    </form>
  );
};

export default Register;
