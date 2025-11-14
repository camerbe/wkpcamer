import { Observable } from "rxjs";

export interface CacheEntry<T> {
  data$: Observable<T>;
  timestamp: number;
}
