import CampdGame from './interface/campd-game.interface';

namespace CampdResponse {
  export interface GetGames extends ApiResponse {
    games: CampdGame[];
  }
}

export default CampdResponse;
