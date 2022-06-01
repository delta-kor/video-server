import { Document } from 'mongoose';

interface MediaUpload {
  data: MediaData;
  action?: Action;
}

interface Media extends Document {
  id: string;
  data: MediaData;
  action?: Action;
  duration: number;
  isSequence: boolean;

  toJSON(): any;
}

namespace MediaData {
  export interface Empty {
    type: 'empty';
    duration: number;
  }

  export interface IZFLIXVideo {
    type: 'izflix_video';
    video_id: string;
  }

  export interface Youtube {
    type: 'youtube';
    youtube_id: string;
  }

  export interface IZFLIXVideoVoteSequence {
    type: 'izflix_video_vote_sequence';
  }
}

namespace Action {
  export interface IZFLIXVideoVote {
    type: 'video_vote';
    candidate: string[];
  }
}

type Action = Action.IZFLIXVideoVote;
type MediaData = MediaData.Empty | MediaData.IZFLIXVideo | MediaData.Youtube;

export { Media, MediaUpload, Action, MediaData };
