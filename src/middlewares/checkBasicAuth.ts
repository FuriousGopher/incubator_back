import { NextFunction, Response, Request } from 'express';

export function checkBasicAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const splitHeaderAuth = authHeader.split(' ')[1];
  const headerAuth = Buffer.from(splitHeaderAuth, 'base64').toString('ascii');
  const [login, password] = headerAuth.split(':');

  if (login !== 'admin' || password !== 'qwerty') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}
