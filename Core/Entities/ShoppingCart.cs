namespace Core.Entities;
//ShoppingCart nije EF entitet zato što se čuva u Redis-u koji je key-value store, a ne relaciona baza.
public class ShoppingCart //nije EF entitet, kao ni CartItem(ne nasledjuju Base Entity)
{
  public required string Id { get; set; } //Ovo nije database-generated ID
  public List<CartItem> Items { get; set; } = [];
  public int? DeliveryMethodId { get; set; }
  public string? ClientSecret { get; set; }
  public string? PaymentIntentId { get; set; }
}