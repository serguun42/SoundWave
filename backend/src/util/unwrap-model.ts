/**
 * @type {import('../types/db-models').UnwrapEntity}
 */
const UnwrapModel = (model) => {
  if (Array.isArray(model)) return model.map((row) => row.dataValues || row);

  return model?.dataValues || model;
};

export default UnwrapModel;
