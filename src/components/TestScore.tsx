import React from "react";
import { Tag } from "../lib/index";
import { FormatLangText } from "./Editor/SunEditor/utils";
import { TEXTS } from "texts/texts";
export default function TestScore({
  score,
  language
}: {
  score: { correct: number; incorrect: number };
  language: string;
}) {
  return (
    <Tag style={{ textAlign: "center", marginRight: 0 }} color="blue-inverse">
      {FormatLangText(TEXTS.SCORE, language)}(+ {score.correct}{" "}
      {score?.incorrect ? <span>, {score.incorrect}</span> : null} )
    </Tag>
  );
}
