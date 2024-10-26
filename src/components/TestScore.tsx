import React from "react";
import { Tag } from "../lib/index";

import { useText } from "./Editor/SunEditor/utils";
export default function TestScore({
  score,
  language
}: {
  score: { correct: number; incorrect: number };
  language: string;
}) {
  const { FormatLangText } = useText(language);
  return (
    <Tag style={{ textAlign: "center", marginRight: 0 }} color="blue-inverse">
      {FormatLangText('SCORE')}(+ {score.correct}{" "}
      {score?.incorrect ? <span>, {score.incorrect}</span> : null} )
    </Tag>
  );
}
