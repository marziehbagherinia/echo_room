const { getAllGroups } = require('../../Services/AuthService')

const GroupIndexJob = async () => {
  try {
    const allGroups = await getAllGroups();

    const groups = {};

    for (const group of allGroups) {
      groups[group.slug] = [];
    }

    return groups;

  } catch (error) {
    throw error;
  }
};

module.exports = GroupIndexJob;
