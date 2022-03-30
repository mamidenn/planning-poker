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
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-4">
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
            className={classNames(
              "hover:translate-y-0 translate-y-16 transition-transform -ml-12 shadow-md pointer-events-auto",
              {
                invisible: amount === session.votes[userId],
              }
            )}
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
    </>
  );
};

export default Session;
