import BaseRepository from "../baseRepository";
import type { AnswerResponse } from "./types";


const BASE_URL = "https://quizapi.io/api/v1/";

class QuizRepository extends BaseRepository<AnswerResponse> {
    private static instance: QuizRepository;

    private constructor() {
        super(BASE_URL);
    }

    public static getInstance(): QuizRepository {
        if (!QuizRepository.instance) {
            QuizRepository.instance = new QuizRepository();
        }
        return QuizRepository.instance;
    }
    
    async getQuizz(params: Record<string, string>) {
        // Adjust endpoint to call /questions with query params
        const qs = new URLSearchParams(params).toString();
        const endpoint = `questions${qs ? `?${qs}` : ""}`;
        const response = await this.list(endpoint, {
            headers: {
                "apiKey": process.env.QUIZ_API_KEY || "",
            },
        });
        return response;
    }
}

export default QuizRepository;