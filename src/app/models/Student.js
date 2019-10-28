import Sequelize, { Model } from 'sequelize';
import { differenceInYears } from 'date-fns';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        peso: Sequelize.FLOAT,
        altura: Sequelize.FLOAT,
        idade: {
          type: Sequelize.VIRTUAL,
          get() {
            return differenceInYears(new Date(), this.birth_date);
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Student;
