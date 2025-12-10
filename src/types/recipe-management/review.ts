export interface ReviewDto {
  reviewId: number;
  recipeId?: number;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewResponse {
  recipeId?: number;
  averageRating?: number;
  reviewCount?: number;
  reviews?: ReviewDto[];
}

export interface AddReviewRequest {
  rating: number;
  comment?: string;
}

export interface EditReviewRequest {
  rating: number;
  comment?: string;
}
