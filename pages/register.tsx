import { Button } from "components";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useEffect, useRef } from "react";

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
  const nameInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameInput.current?.focus();
  });

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        autoComplete="off"
        method="post"
        action="/api/register"
        className="flex flex-col gap-2 outline outline-1 outline-gray-900/5 rounded-lg shadow-lg p-8 bg-white"
      >
        <label htmlFor="name">Please choose a name:</label>
        <input
          type="text"
          name="name"
          id="name"
          ref={nameInput}
          autoFocus
          className="outline-none px-2 py-1 border-b-2 focus:border-b-orange-500"
        />
        <input type="hidden" name="source" value={source} />
        <Button primary type="submit">
          Let&apos;s go!
        </Button>
      </form>
    </div>
  );
};

export default Register;
