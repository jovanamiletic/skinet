using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specifications;

// Expression<Func<T,bool>> → šta tražim
// BaseSpecification<T> → pakujem uslov u objekat
// ISpecification<T> → ugovor koji repo razume
// T → radi za bilo koji entitet
public class BaseSpecification<T>(Expression<Func<T, bool>>? criteria) : ISpecification<T>
{
  protected BaseSpecification() : this(null) { }// Ovaj konstruktor omogućava da napraviš specification bez filtera, ali sa Include / Sort / Paging logikom, i to samo iz naslednih klasa.
  public Expression<Func<T, bool>>? Criteria => criteria;

  public Expression<Func<T, object>>? OrderBy { get; private set; }

  public Expression<Func<T, object>>? OrderByDescending { get; private set; }

  protected void AddOrderBy(Expression<Func<T, object>> orderByExpression)
  {
    OrderBy = orderByExpression;
  }
  protected void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
  {
    OrderByDescending = orderByDescExpression;
  }

  public bool IsDistinct { get; private set; }
  protected void ApplyDistinct()
  {
    IsDistinct = true;
  }

  public int Take { get; private set; }

  public int Skip { get; private set; }

  public bool isPagingEnabled { get; private set; }

  public List<Expression<Func<T, object>>> Includes { get; } = [];
  public List<string> IncludeStrings { get; } = []; // For ThenInclude

  protected void ApplyPaging(int skip, int take)
  {
    Skip = skip;
    Take = take;
    isPagingEnabled = true;
  }
  public IQueryable<T> ApplyCriteria(IQueryable<T> query)
  {
    if (Criteria != null)
    {
      query = query.Where(Criteria);
    }
    return query;
  }

  protected void AddInclude(Expression<Func<T, object>> includeExpression)
  {
    Includes.Add(includeExpression);
  }

  protected void AddInclude(string includeString)
  {
    IncludeStrings.Add(includeString); // For ThenInclude
  }
}

public class BaseSpecification<T, TResult>(Expression<Func<T, bool>>? criteria)
            : BaseSpecification<T>(criteria), ISpecification<T, TResult>
{
  protected BaseSpecification() : this(null) { }
  public Expression<Func<T, TResult>>? Select { get; private set; }

  protected void AddSelect(Expression<Func<T, TResult>> selectExpression)
  {
    Select = selectExpression;
  }
}