import { body } from 'express-validator';

export const updateProfileValidator = [
    body('username')
        .optional({ checkFalsy: true })
        .isString().withMessage('Username must be a string')
        .trim(),
    body('email')
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Invalid email format'),
    body('phone_number')
        .optional({ checkFalsy: true })
        .isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
    body('dob')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Invalid date format for DOB'),
    body('city')
        .optional({ checkFalsy: true })
        .isString().withMessage('City must be a string')
        .trim(),
    body('country')
        .optional({ checkFalsy: true })
        .isString().withMessage('Country must be a string')
        .trim()
];
