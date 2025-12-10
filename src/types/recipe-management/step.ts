export interface RecipeStepDto {
  stepId: number;
  recipeId?: number;
  stepNumber: number;
  instruction: string;
  optional?: boolean;
  timerSeconds?: number;
  createdAt?: string;
}

export interface StepCommentDto {
  commentId: number;
  recipeId?: number;
  stepId: number;
  userId: string;
  commentText: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface StepResponse {
  recipeId: number;
  steps: (RecipeStepDto & {
    comments?: StepCommentDto[];
  })[];
}

export interface AddStepCommentRequest {
  comment: string;
  isPublic?: boolean;
}

export interface EditStepCommentRequest {
  commentId: number;
  comment: string;
}

export interface DeleteStepCommentRequest {
  commentId: number;
}

export interface StepCommentResponse {
  stepId?: number;
  comments?: StepCommentDto[];
}
