
import { createAction, props } from '@ngrx/store';


export const loadArticles= createAction(
  '[Article] Load Articles',
  props<{ params?: any }>()
);
export const loadArticlesSuccess = createAction(
  '[Article] Load Articles Success',
  props<{ articles: any[] }>()
);
export const selectArticle = createAction(
  '[Article] Select Article',
  props<{ articleId: number }>()
);
export const clearSelectedArticle = createAction(
  '[Article] Clear Selected Article'
);
export const createArticle = createAction(
  '[Article] Create Article',
  props<{ article: any }>()
);
export const updateArticle = createAction(
  '[Article] Update Article',
  props<{ articleId: number; changes: any }>()
);
export const deleteArticle = createAction(
  '[Article] Delete Article',
  props<{ articleId: number }>()
);
export const loadArticlesFailure = createAction(
  '[Article] Load Articles Failure',
  props<{ error: any }>()
);

