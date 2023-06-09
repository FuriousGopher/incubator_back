import { body } from 'express-validator';
import { Resolutions } from '../models/videoTypes';

const dataRegex =
  /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/;

export const validatorVideoBody = [
  body('title').notEmpty().withMessage('Need write a tittle ').isLength({ max: 40 }).withMessage('max 40'),
  body('author').notEmpty().withMessage('Need write a author').isLength({ max: 20 }).withMessage('max 20'),
  body('availableResolutions')
    .isArray()
    .withMessage('need to be Array')
    .custom((value: Resolutions[]) => value.every((resolution) => Object.values(Resolutions).includes(resolution)))
    .withMessage('need put good resolution'),
  body('canBeDownloaded').optional().isBoolean().withMessage('yes/no'),
  body('minAgeRestriction').optional().isInt({ min: 1, max: 18 }).withMessage('from 1 to 18'),
  body('publicationDate').optional().isString().withMessage('need to be a string').matches(dataRegex).withMessage('need normal format'),
];
