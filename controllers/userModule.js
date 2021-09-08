const util = require("util");
const db = require("../db_connection");

module.exports.getAllModulesByUserId = async (req, res) => {
  const userId = req.params.userId;
  if (userId.length > 45) {
    return res.status(400).send({ message: "Invalid User Id" });
  }

  const query = util.promisify(db.query).bind(db);

  // Get the User id using userId
  const user = await query(
    `SELECT ut.id FROM tbl_user ut WHERE userId=${userId}`
  );
  if (user.length === 0) {
    // Means user not present with given userId
    return res.status(404).send({ message: "Unable to Find the User" });
  }

  // Creating Query;
  const QUERY = `select t.moduleName,t.moduleUrl,t.moduleicon,t.parentModuleId,t.moduleType,t.id,max(t.isAuthorized) isAuthorized from ( select distinct tmm.moduleName,tmm.moduleUrl,tmm.moduleIcon,tmm.parentModuleId,tmm.moduleType,tmm.id, case when tg.id is null then 0 else 1 end as isAuthorized from tbl_module_master tmm left join tbl_group_module_rights tgmr on tmm.id=tgmr.moduleId left join (select * from tbl_user_to_group where userid=${user[0].id}) tg on tg.groupId=tgmr.groupId) t group by t.moduleName,t.moduleUrl,t.moduleIcon,t.parentModuleId order by id`;

  // Recourds Created By id
  const menuResult = await query(QUERY);

  // Shaping Response
  const parentList = [];

  /*
    Here not using recursion because we have only 2 Level menu
    Menu -> sub menu
  */
  menuResult.forEach(({ moduleType, ...eachMenu }) => {
    eachMenu.key = eachMenu.id;
    if (String(moduleType).toLowerCase().trim() === "menu") {
      eachMenu.children = [];
      parentList.push(eachMenu);
    } else {
      parentList.forEach((singleMenu) => {
        if (eachMenu.parentModuleId === singleMenu.id) {
          singleMenu.children.push(eachMenu);
        }
      });
    }
  });

  // For the SubMenu

  return res.status(200).send({
    status: 1,
    message: "All module fetched successfully",
    data: parentList,
  });
};
