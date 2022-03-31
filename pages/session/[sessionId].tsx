import { Button, HandOfCards, PokerCard } from "components";
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
      <div className="fixed bottom-0 translate-y-16">
        <HandOfCards
          values={[...fibonacci(10), "?"]}
          selected={session.votes[userId]}
          onSelection={(value) =>
            setSession({
              ...session,
              votes: { ...session.votes, [userId]: value },
            })
          }
        />
      </div>
      <div className="flex gap-4 my-4">
        <Button
          primary
        onClick={() =>
          setSession({
            ...session,
            revealed: !session.revealed,
          })
        }
      >
        Flip cards
        </Button>
        <Button
        onClick={() =>
          setSession({
            ...session,
            revealed: false,
            votes: {},
          })
        }
      >
        Reset vote
        </Button>
      </div>
    </div>
  );
};

export default Session;
