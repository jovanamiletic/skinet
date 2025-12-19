namespace Core.Entities;

public class CartItem // nije EF entitet(ne nasledjuje BaseEntity)
{
  public int ProductId { get; set; }
  public required string ProductName { get; set; }
  public decimal Price { get; set; }
  public int Quantity { get; set; }
  public required string PictureUrl { get; set; }
  public required string Brand { get; set; }
  public required string Type { get; set; }
}