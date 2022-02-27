import { ReactionType } from "./reaction-type.enum";

export interface PostReaction {

  postId: number;
  reaction: ReactionType;
  
}