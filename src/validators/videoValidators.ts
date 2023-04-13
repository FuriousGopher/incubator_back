import {body} from 'express-validator';
import {Resolutions} from '../models/videoTypes';


const dataRegex = /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/

export const validatorVideoBody = () => [
    body('title')
        .notEmpty()
        .withMessage('Error')
        .isLength({max: 40})
        .withMessage('Error'),
    body('author')
        .notEmpty()
        .withMessage('Error')
        .isLength({max: 20})
        .withMessage('Error'),
    body('availableResolutions')
        .isArray()
        .withMessage('Error')
        .custom((value: Resolutions[]) =>
            value.every((resolution) => Object.values(Resolutions).includes(resolution))
        )
        .withMessage('Error'),
    body('canBeDownloaded')
        .optional()
        .isBoolean()
        .withMessage('Error'),
    body('minAgeRestriction')
        .optional()
        .isInt({min: 1, max: 18})
        .withMessage('Error'),
    body('publicationDate')
        .optional()
        .isString()
        .withMessage('Error')
        .matches(dataRegex)
        .withMessage('Error'),
];
