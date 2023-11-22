import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const getInstitutionBranchList = async (req, res) => {
    const {institution_id} = req.params;
    const branches = await models.InstitutionBranch.findAll({where: {institution_id}});

    return res.status(200).json(createResponse(branches));
}

export const createBranch = async (req, res) => {
    const {institution_id} = req.params;
    const {address, address_description, call_phone, whatsapp_phone, email, instagram_url, two_gis_url, yandex_url, coordinates} = req.body;

    if (!institution_id || !address) return res.status(500).json(createError("Не хватает параметров"));

    const institution = await models.Institution.findByPk(institution_id);
    if (!institution) return res.status(500).json(createError("Учреждение не найденно"))

    let newBranch
    try {
        newBranch = await models.InstitutionBranch.create({
            address, address_description, call_phone, whatsapp_phone, email, instagram_url, two_gis_url, yandex_url, coordinates
        })
        await newBranch.setInstitution(institution)
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    return res.status(200).json(createResponse(newBranch));
}

export const updateBranch = async (req, res)  => {
    const {institution_id, branch_id} = req.params;
    const {address, address_description, call_phone, whatsapp_phone, email, instagram_url, two_gis_url, yandex_url, coordinates} = req.body;
    if (!institution_id || !branch_id) return res.status(500).json(createError("Не хватает параметров"));

    let updatedBranch
    try {
        [,updatedBranch] = await models.InstitutionBranch.update(
            {address, address_description, call_phone, whatsapp_phone, email, instagram_url, two_gis_url, yandex_url, coordinates},
            {where: {id: branch_id, institution_id}, returning: true, plain: true}
        )
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить"));
    }

    return res.status(200).json(createResponse(updatedBranch));
}

export const deleteBranch = async (req, res)  => {
    const {institution_id, branch_id} = req.params;
    if (!institution_id || !branch_id) return res.status(500).json(createError("Не хватает параметров"));

    try {
        await models.InstitutionBranch.destroy({where: {id: branch_id, institution_id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"));
    }

    return res.status(200).json({status: "OK"})
}