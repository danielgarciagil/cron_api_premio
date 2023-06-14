import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const config = registerAs('config', () => {
  return {
    PORT: process.env.PORT,
    URL_API: process.env.URL_API,
  };
});

export const validationENV = () => {
  return Joi.object({
    PORT: Joi.number().required(),
    URL_API: Joi.string().required(),
  });
};
