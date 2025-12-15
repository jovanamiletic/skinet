export type Pagination<T> = {
  pageIndex: number; //koja strana mi treba
  pageSize: number; //koliko elemenata na strani
  count: number;
  data: T[]
}