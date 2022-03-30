import classNames from "classnames";
import { PokerCard } from "components";
import { usePokerSession } from "hooks/usePokerSession";
import { GetServerSideProps, NextPage } from "next";
import { fibonacci } from "utils/fibonacci";

interface Props {
  sessionId: string;
  userId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.req.cookies.user)
    return {
      redirect: {
        destination: `/register?source=/session/${context.params!.sessionId}`,
        permanent: false,
      },
    };
  const { user_id } = JSON.parse(context.req.cookies.user);
  return {
    props: { userId: user_id, sessionId: context.params!.sessionId },
  };
};

const Session: NextPage<Props> = ({ sessionId, userId }) => {
  const { session, setSession, members } = usePokerSession(sessionId);

  if (!session) return <></>;

  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-screen">
      <div className="flex flex-wrap justify-center gap-8">
        {members.map((m) => (
          <PokerCard
            key={m.id}
            player={m.info.name}
            value={session.votes[m.id] || ""}
            state={
              session.votes[m.id] === undefined
                ? "unplayed"
                : session.revealed
                ? "faceUp"
                : "faceDown"
            }
          />
        ))}
      </div>
      <div className="fixed bottom-0 pl-12 flex justify-center gap-2 pointer-events-none">
        {[...fibonacci(10), "?"].map((amount) => (
          <button
            key={amount}
            className={
              "disabled:opacity-0 disabled:-translate-y-16 disabled:pointer-events-none hover:translate-y-0 translate-y-16 transition-all -ml-12 shadow-md pointer-events-auto"
            }
            disabled={amount === session.votes[userId]}
            onClick={() =>
              setSession({
                ...session,
                votes: { ...session.votes, [userId]: amount },
              })
            }
          >
            <PokerCard value={amount} state="faceUp" />
          </button>
        ))}
      </div>
      <button
        onClick={() =>
          setSession({
            ...session,
            revealed: !session.revealed,
          })
        }
      >
        Flip cards
      </button>
      <button
        onClick={() =>
          setSession({
            ...session,
            revealed: false,
            votes: {},
          })
        }
      >
        Reset vote
      </button>
    </div>
  );
};

export default Session;
