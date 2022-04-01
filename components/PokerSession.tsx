import classNames from "classnames";
import { Button, HandOfCards, PokerCard } from "components";
import { usePokerSession } from "hooks/usePokerSession";
import { countBy, filter, groupBy, isEmpty, map, mean } from "lodash";
import { FC } from "react";
import { fibonacci } from "utils/fibonacci";

interface Props {
  sessionId: string;
  userId: string;
}

export const PokerSession: FC<Props> = ({ sessionId, userId }) => {
  const { session, setSession, members } = usePokerSession(sessionId);

  if (!session) return <></>;

  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-screen gap-4">
      <div className="flex flex-wrap justify-center gap-8">
        {members.map((m) => (
          <div key={m.id} className="w-36">
            <PokerCard
              player={m.info.name}
              value={session.votes[m.id]}
              state={
                session.votes[m.id] === undefined
                  ? "unplayed"
                  : session.revealed
                  ? "faceUp"
                  : "faceDown"
              }
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 my-4">
        <Button
          primary
          onClick={() =>
            isEmpty(session.votes) ||
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
      <div
        className={classNames({
          "transition-opacity": session.revealed,
          "opacity-0": !session.revealed,
        })}
      >
        <h2 className="text-2xl">Results:</h2>
        <table className="text-xl text-center">
          <thead className="border-b-2">
            {map(groupBy(session.votes), (v) => (
              <th className="p-2">{v[0] > 0 ? v[0] : "?"}</th>
            ))}
            <th className="p-2">&#8709;</th>
          </thead>
          <tbody>
            {map(countBy(session.votes), (c) => (
              <td className="p-2">{c}</td>
            ))}
            <td className="p-2">
              {mean(filter(session.votes, (v) => v >= 0)).toLocaleString(
                undefined,
                { maximumFractionDigits: 1 }
              ) || "?"}
            </td>
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-4">
        <HandOfCards
          values={[...fibonacci(10), -1]}
          selected={session.votes[userId]}
          onSelection={(value) =>
            setSession({
              ...session,
              votes: { ...session.votes, [userId]: value },
            })
          }
        />
      </div>
    </div>
  );
};

export default PokerSession;
