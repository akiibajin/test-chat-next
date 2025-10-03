export type Category = "Linux" | "DevOps" | "Networking" | "Docker"
export type Difficulty = "Easy" | "Medium" | "Hard"
export type Tags<Str extends string> = `${Str}, ${Str}` | `${Str}`

export interface AnswerToolParams {
    category?: Category;
    difficulty?: Difficulty;
    tags?: Tags<string>;
    limit?: number; // 1-10    
}