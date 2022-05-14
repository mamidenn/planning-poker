import { PokerSession } from "components";
import { Pusher } from "context";
import { GetServerSideProps, NextPage } from "next";

interface Props {
  sessionId: string;
  userId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { user_id } = JSON.parse(context.req.cookies.user);
  return {
    props: { userId: user_id, sessionId: context.params!.sessionId },
  };
};

const Session: NextPage<Props> = ({ sessionId, userId }) => {
  return (
    <Pusher>
      <PokerSession sessionId={sessionId} userId={userId} />
    </Pusher>
  );
};

export default Session;
