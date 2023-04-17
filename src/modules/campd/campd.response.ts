import CampdGame, { CampdGameResult } from './interface/campd-game.interface';

namespace CampdResponse {
  export interface GetGames extends ApiResponse {
    games: CampdGame[];
  }

  export interface Submit extends ApiResponse {
    result: CampdGameResult;
  }
}

export default CampdResponse;
