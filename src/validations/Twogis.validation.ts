import { check, ValidationChain } from 'express-validator';

export default class TwogisValidation {
  public schema = (): ValidationChain[] => [
    check('*.search').not().isEmpty(),
    check('*.sendTo').not().isEmpty(),
    check('*.filter').not().isEmpty(),
    check('*.url').not().isEmpty(),
  ]
}
