import { Button } from "components";
import { randomInt } from "crypto";
import { range } from "lodash";
import { InferGetServerSidePropsType, NextPage } from "next";

export const getServerSideProps = async () => {
  return {
    props: {
      randomId: range(16).reduce((c) => (c += randomInt(36).toString(36)), ""),
    },
  };
};

const Main: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  return (
    <form
      method="post"
      action={`/api/sessions/${props.randomId}`}
      className="flex justify-center items-center min-h-screen"
    >
      <Button primary type="submit">
        Create a new Planning Poker Session!
      </Button>
    </form>
  );
};

export default Main;
