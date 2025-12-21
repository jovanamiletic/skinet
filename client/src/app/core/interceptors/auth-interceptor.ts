import { HttpInterceptorFn } from '@angular/common/http'; 
//Interceptor = middleware za HTTP zahteve (slično kao middleware u ASP.NET-u)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //HTTP request u Angularu je immutable (ne možeš ga menjati direktno) -> zato ga kloniras
  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest); //“Evo izmenjen request, nastavi dalje”
};