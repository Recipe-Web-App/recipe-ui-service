export interface RecipeStepDto {
  stepId: number;
  stepNumber: number;
  instruction: string;
  duration?: number;
  order: number;
}

export interface StepCommentDto {
  commentId: number;
  stepId: number;
  userId: number;
  comment: string;
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
  userId: number;
}

export interface EditStepCommentRequest {
  commentId: number;
  comment: string;
  userId: number;
}

export interface DeleteStepCommentRequest {
  commentId: number;
  userId: number;
}

export interface StepCommentResponse {
  stepId?: number;
  comments?: StepCommentDto[];
}
