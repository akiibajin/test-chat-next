import { z } from "zod";
import { tool } from "@langchain/core/tools";
import QuizRepository from "@/repositories/quiz/quizRepository";
import type { AnswerToolParams } from "./types";

const fetchQuizQuestionTool = tool(
  async (input: unknown) => {
    const { category, difficulty, limit, tags } = input as AnswerToolParams;
    if (!process.env.QUIZ_API_KEY) {
      return "Quiz API key not configured.";
    }
    const repo = QuizRepository.getInstance();
    const params: Record<string, string> = {};
    if (category) params.category = category;
    if (difficulty) params.difficulty = difficulty;
    if (tags) params.tags = tags;
    params.limit = String(limit ?? 1);

    const data: any = await repo.getQuizz(params);
    if (!Array.isArray(data) || data.length === 0) {
      return "No quiz questions found for the given parameters.";
    }

    const q = data[0];
    const answers: string[] = [];
    if (q.answers) {
      Object.entries(q.answers).forEach(([k, v]) => {
        if (v) answers.push(`${k.replace("answer_", "").toUpperCase()}: ${v}`);
      });
    }

    let correct: string[] = [];
    if (q.correct_answers) {
      correct = Object.entries(q.correct_answers)
        .filter(([_, val]) => val === "true")
        .map(([k]) =>
          k.replace("_correct", "").replace("answer_", "").toUpperCase(),
        );
    }

    return [
      `Quiz Question: ${q.question}`,
      answers.length
        ? `Options:\n${answers.map((a) => `- ${a}`).join("\n")}`
        : "No options.",
      correct.length
        ? `Correct Answer(s) (for validation): ${correct.join(", ")}`
        : "Correct answer metadata not available.",
    ].join("\n\n");
  },
  {
    name: "fetch_quiz_question",
    description:
      "Fetch a programming quiz question. Optional: category, difficulty (Easy|Medium|Hard), tags, limit (1-10).",
    schema: z.object({
      category: z.string().optional(),
      difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
      tags: z.string().optional(),
      limit: z.number().int().min(1).max(10).optional().default(1),
    }),
  },
);

export default fetchQuizQuestionTool;
