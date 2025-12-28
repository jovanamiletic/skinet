using System;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class CouponService : ICouponService
{
  public CouponService(IConfiguration config)
  {
    StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
  }

  public async Task<AppCoupon?> GetCouponFromPromoCode(string code)
  {
    var promotionService = new PromotionCodeService();

    // var options = new PromotionCodeListOptions
    // {
    //   Code = code
    // };
    var options = new PromotionCodeListOptions
    {
      Code = code,
      Active = true,
      Limit = 1,
      Expand = new List<string> { "data.promotion.coupon" }
    };

    var promotionCodes = await promotionService.ListAsync(options);

    var promotionCode = promotionCodes.FirstOrDefault();

    if (promotionCode != null && promotionCode.Promotion.Coupon != null)
    {
      return new AppCoupon
      {
        Name = promotionCode.Promotion.Coupon.Name,
        AmountOff = promotionCode.Promotion.Coupon.AmountOff,
        PercentOff = promotionCode.Promotion.Coupon.PercentOff,
        CouponId = promotionCode.Promotion.Coupon.Id,
        PromotionCode = promotionCode.Code
      };
    }

    return null;
  }
}