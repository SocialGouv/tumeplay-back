import { Container } from 'typedi';
import { IUser } from '../../interfaces/IUser';

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
  const Logger: any = Container.get('logger');
  try {
    const UserModel: any = Container.get('userModel');
    Logger.debug('Request:', req);
    const currentUser:IUser = await UserModel.findOne({ where: { id: req.token._id }, include: ['profile'] });
    if (!currentUser) {
      return res.sendStatus(401);
    }
    Reflect.deleteProperty(currentUser, 'password');
    Reflect.deleteProperty(currentUser, 'salt');
    req.currentUser = currentUser;
    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;