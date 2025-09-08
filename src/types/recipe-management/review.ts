export interface ReviewDto {
  reviewId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
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
  userId: number;
}

export interface EditReviewRequest {
  rating: number;
  comment?: string;
  userId: number;
}
