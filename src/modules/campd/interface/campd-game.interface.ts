interface CampdGame {
  id: string;
  title: string;
  description: string;
  score: number;
}

interface CampdGameInput {
  [key: number]: number;
}

interface CampdGameResult {
  total_score: number;
  group_bonus: number;
  solo_bonus: number;
  long_penalty: number;
  short_penalty: number;
  miss_penalty: number;
  exp: number;
}

export { CampdGameInput, CampdGameResult };
export default CampdGame;
