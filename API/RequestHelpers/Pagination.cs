namespace API.RequestHelpers;

public class Pagination<T>(int pageIndex, int pageSize, int count, IReadOnlyList<T> data)
{
  public int PageIndex { get; set; } = pageIndex; // koja stranica je vracena
  public int PageSize { get; set; } = pageSize; // koliko elemenata ima jedna stranica
  public int Count { get; set; } = count; // broj elemenata u bazi POSLE filtriranja, ali PRE paginacije
  public IReadOnlyList<T> Data { get; set; } = data;
}
