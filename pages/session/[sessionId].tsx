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
      {[...fibonacci(10), "?"].map((amount) => (
        <button
          key={amount}
          className="bg-slate-400 p-4 m-4"
          onClick={() =>
            setSession({
              ...session,
              votes: { ...session.votes, [userId]: amount },
            })
          }
        >
          {amount}
        </button>
      ))}
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
    </>
  );
};

export default Session;
