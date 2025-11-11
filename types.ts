export interface Country {
  name: string;
  code: string;
}

export enum GameState {
  Playing = 'PLAYING',
  Answered = 'ANSWERED',
  Finished = 'FINISHED',
}