import React from "react";
import { Tag } from "../lib/index";
export default function TestScore({
  score,
}: {
  score: { correct: number; incorrect: number };
}) {
  return (
    <Tag style={{ textAlign: "center", marginRight: 0 }} color="blue-inverse">
      Score(+ {score.correct}{" "}
      {score?.incorrect ? <span>, {score.incorrect}</span> : null} )
    </Tag>
  );
}
