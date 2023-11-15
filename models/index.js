import {Sequelize, Op} from "sequelize";
import 'dotenv/config';

import getRoleModel from "./role.js";
import getUserModel from "./user.js";
import getCategoryModel from "./category.js";
import getSubjectModel from "./subject.js";
import getInstitutionModel from "./institution.js";
import getParentModel from "./parent.js";
import getChildModel from "./child.js";
import getSmsConfirmModel from "./smsConfirm.js";
import getInstitutionSubjectModel from "./institutionSubject.js";
import getInstitutionGroupModel from "./institutionGroup.js";
import getInstitutionBranchModel from "./institutionBranch.js";
import getTrialRegistrationModel from "./trialRegistration.js";
import getRequestModel from "./request.js";

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    operatorsAliases: {
        $like: Op.like,
    },
    logging: false
});

const models = {
    Role: getRoleModel(sequelize),
    User: getUserModel(sequelize),

    Category: getCategoryModel(sequelize),
    Subject: getSubjectModel(sequelize),

    Parent: getParentModel(sequelize),
    Child: getChildModel(sequelize),
    SmsConfirm: getSmsConfirmModel(sequelize),

    Institution: getInstitutionModel(sequelize),
    InstitutionSubject: getInstitutionSubjectModel(sequelize),
    InstitutionGroup: getInstitutionGroupModel(sequelize),
    InstitutionBranch: getInstitutionBranchModel(sequelize),

    TrialRegistration: getTrialRegistrationModel(sequelize),

    Request: getRequestModel(sequelize),
}

// Связываю юзера и роли
models.User.belongsTo(models.Role, {foreignKey: "role_id"});

// Связываю предметы и категории
models.Subject.belongsToMany(models.Category, {through: "category_subject", as: "categories"});
models.Category.belongsToMany(models.Subject, {through: "category_subject", as: "subjects"});

// Связываю клиента (Родителя) и клиента (Ребенок)
models.Child.belongsTo(models.Parent, {foreignKey: "parent_id"});
models.Parent.hasMany(models.Child, {foreignKey: "parent_id"});

// Связываю учереждение и директора
models.Institution.hasOne(models.User, {foreignKey: "institution_id", as: "director"});
models.User.hasOne(models.Institution, {foreignKey: "director_id", as: "institution" });

// Связываю предметы и предметы центра
models.InstitutionSubject.belongsTo(models.Subject, {foreignKey: "subject_id"});

// Связываю учереждение и предметы центра
models.InstitutionSubject.belongsTo(models.Institution, {foreignKey: "institution_id"});
models.Institution.hasMany(models.InstitutionSubject, {foreignKey: "institution_id"});

// Связываю группу с учреждением, адресом и предметом
models.InstitutionGroup.belongsTo(models.Institution, {foreignKey: "institution_id"});
models.Institution.hasMany(models.InstitutionGroup, {foreignKey: "institution_id"});

models.InstitutionGroup.belongsTo(models.InstitutionSubject, {foreignKey: "institution_subject_id"});
models.InstitutionSubject.hasMany(models.InstitutionGroup, {foreignKey: "institution_subject_id"});

models.InstitutionGroup.belongsTo(models.InstitutionBranch, {foreignKey: "institution_branch_id"});

// Связываю адреса и центр
models.InstitutionBranch.belongsTo(models.Institution, {foreignKey: "institution_id"});
models.Institution.hasMany(models.InstitutionBranch, {foreignKey: "institution_id"});

// Связываю регистрацию на пробный
models.TrialRegistration.belongsTo(models.InstitutionGroup, {foreignKey: "institution_group_id"})
models.InstitutionGroup.hasMany(models.TrialRegistration, {foreignKey: "institution_group_id"})
models.TrialRegistration.belongsTo(models.Institution, {foreignKey: "institution_id"})
models.Institution.hasMany(models.TrialRegistration, {foreignKey: "institution_id"})

models.TrialRegistration.belongsTo(models.Parent, {foreignKey: "parent_id"})
models.Parent.hasMany(models.TrialRegistration, {foreignKey: "parent_id"})

models.TrialRegistration.belongsTo(models.Child, {foreignKey: "child_id"})
models.Child.hasMany(models.TrialRegistration, {foreignKey: "child_id"})

// Связываю запросы
models.Request.belongsTo(models.User, {foreignKey: "user_id"});
models.User.hasMany(models.Request, {foreignKey: "user_id"});

export {sequelize};

export default models;