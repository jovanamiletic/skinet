using System.Linq.Expressions;

namespace Core.Interfaces;

public interface ISpecification<T>
{
  Expression<Func<T, bool>>? Criteria { get; } // WHERE u ProductRepository
  Expression<Func<T, object>>? OrderBy { get; } // OrderBy
  Expression<Func<T, object>>? OrderByDescending { get; } // OrderByDescending
  bool IsDistinct { get; }
  int Take { get; }
  int Skip { get; }
  bool isPagingEnabled { get; }
  IQueryable<T> ApplyCriteria(IQueryable<T> query);
}

public interface ISpecification<T, TResult> : ISpecification<T> // projection
{
  Expression<Func<T, TResult>>? Select { get; }
}