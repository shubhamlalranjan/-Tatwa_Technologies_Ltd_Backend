const util = require("util");
const db = require("../db_connection");

module.exports.getAllModulesByUserId = async (req, res) => {
  const userId = req.params.userId;
  if (userId.length > 45) {
    return res.status(400).send({ message: "Invalid User Id" });
  }

  const query = util.promisify(db.query).bind(db);

  // Get the User id using userId
  const user = await query(`SELECT id FROM tbl_user WHERE userId=${userId}`);
  if (user.length === 0) {
    // Means user not present with given userId
    return res.status(404).send({ message: "Unable to Find the User" });
  }

  // Recourds Created By id
  const menuResult = await query(
    `SELECT id,moduleName, moduleUrl,moduleIcon,parentModuleId,isActive AS isAuthorized FROM tbl_module_master WHERE createdBy=${user[0].id} ORDER BY parentModuleId ASC`
  );

  // Shaping Response
  const parentList = [];

  menuResult.forEach((eachMenu) => {
    if (eachMenu.parentModuleId === 0) {
      eachMenu.children = [];
      parentList.push(eachMenu);
    } else {
      parentList.forEach((singleMenu) => {
        if (singleMenu.id === eachMenu.parentModuleId) {
          singleMenu.children.push(eachMenu);
        }
      });
    }
  });

  return res.status(200).send({
    status: 1,
    message: "All module fetched successfully",
    data: parentList,
  });
};
