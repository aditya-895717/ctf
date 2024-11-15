import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/[@#$&]/)
    .withMessage('Password must contain at least one special character (@, #, $, &)')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];