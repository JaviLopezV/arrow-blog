// AnimalGamesPage.tsx
"use client";

import * as React from "react";
import { Container, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import type { Lang } from "./animalGame.utils";
import { getLanguageLabel } from "./animalGame.utils";
import { useAnimalGame } from "./useAnimalGame";

import { AnimalGameHeader } from "./AnimalGameHeader";
import { AnimalGameProgress } from "./AnimalGameProgress";
import { AnimalGameCard } from "./AnimalGameCard";
import { AnimalGameFinish } from "./AnimalGameFinish";

export default function AnimalGamesPage() {
  const t = useTranslations("animalGame");
  const locale = useLocale();
  const router = useRouter();
  const sp = useSearchParams();
  const learnLang = (sp.get("lang") as Lang) ?? "en";

  const learnLabel = getLanguageLabel(learnLang, locale);

  const game = useAnimalGame(learnLang);

  const helperText =
    game.status === "correct"
      ? t("helperCorrect")
      : game.status === "wrong"
        ? t("helperWrong")
        : t("helperIdle");

  const feedbackKey =
    game.accuracy >= 80 ? "high" : game.accuracy >= 50 ? "medium" : "low";
  const feedbackSeverity =
    game.accuracy >= 80 ? "success" : game.accuracy >= 50 ? "info" : "warning";

  const backToGames = () => router.push("/games");

  if (game.finished) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <AnimalGameFinish
          title={t("title")}
          backLabel={t("finish.back")}
          onBack={backToGames}
          finishTitle={t("finish.title")}
          languageChosenText={t("languageChosen") + " " + learnLabel}
          correctLabel={t("finish.correct")}
          wrongLabel={t("finish.wrong")}
          accuracyLabel={t("finish.accuracy")}
          correctCount={game.correctCount}
          wrongCount={game.wrongCount}
          accuracy={game.accuracy}
          feedbackText={t(`finish.feedback.${feedbackKey}`)}
          feedbackSeverity={feedbackSeverity}
          playAgainLabel={t("finish.playAgain")}
          onPlayAgain={game.resetGame}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <AnimalGameHeader
          title={t("title")}
          subtitle={t("languageChosen") + " " + learnLabel}
          onBack={backToGames}
          onReset={game.resetGame}
          backAriaLabel={t("finish.back")}
          resetAriaLabel={t("finish.playAgain")}
        />

        <AnimalGameProgress
          value={game.progress}
          indexLabel={`${game.index + 1} / ${game.total}`}
        />

        {game.current && (
          <AnimalGameCard
            animal={game.current}
            learnLabel={learnLabel}
            writePrompt={t("writeWord")}
            answerLabel={t("answerLabel")}
            checkLabel={t("check")}
            skipLabel={t("skip")}
            value={game.value}
            onChange={game.setValue}
            onEnter={game.check}
            helperText={helperText}
            showCorrectAnswer={game.status === "wrong" && game.showAnswer}
            correctAnswerText={t("correctAnswer") + " " + game.expected}
            onCheck={game.check}
            onSkip={game.skip}
            footerText={`${t("finish.correct")}: ${game.correctCount} · ${t("finish.wrong")}: ${game.wrongCount}`}
          />
        )}
      </Stack>
    </Container>
  );
}
