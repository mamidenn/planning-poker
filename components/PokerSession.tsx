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
  const { session, members, reset, flip, vote } = usePokerSession(sessionId);

  if (!session) return <></>;

  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-screen gap-4 pt-4 pb-40">
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
        <Button primary onClick={() => isEmpty(session.votes) || flip()}>
          Flip cards
        </Button>
        <Button onClick={() => reset()}>Reset all votes</Button>
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
            <tr>
              {map(groupBy(session.votes), (v, k) => (
                <th className="p-2" key={k}>
                  {v[0] ?? "?"}
                </th>
              ))}
              <th className="p-2">&#8709;</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {map(countBy(session.votes), (c, k) => (
                <td className="p-2" key={k}>
                  {c}
                </td>
              ))}
              <td className="p-2">
                {(
                  mean(filter(session.votes, (v) => v !== null)) || "?"
                ).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="fixed bottom-4">
        <HandOfCards
          values={[...fibonacci(6), null]}
          selected={session.votes[userId]}
          onSelection={(value) => vote({ [userId]: value })}
        />
      </div>
    </div>
  );
};

export default PokerSession;
