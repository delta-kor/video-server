type TypedRequest<Body = any, Query = any, Params = any> = import('express').Request<Params, any, Body, Query>;
type TypedResponse<Body = any> = import('express').Response<Body>;
type Route = (req: TypedRequest, res: TypedResponse, next: import('express').NextFunction) => Promise<any>;
type VoidedRoute = (req: TypedRequest, res: TypedResponse, next: import('express').NextFunction) => void;
