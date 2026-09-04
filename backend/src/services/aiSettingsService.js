const prisma = require("../config/prisma");

// AiSettings is a singleton table — always exactly one row. Rather than
// requiring a manual seed/migration data step, this lazily creates the
// default row the first time anything asks for settings (webhook boot,
// or the admin settings page loading for the first time).
const getAiSettings = async () => {
  const existing = await prisma.aiSettings.findFirst();
  if (existing) return existing;

  return prisma.aiSettings.create({ data: {} });
};

// Partial update — only the fields passed in `data` are changed.
// Re-fetches the singleton row first so this works correctly even if
// the row didn't exist yet (e.g. very first save from the settings
// page).
const updateAiSettings = async (data) => {
  const settings = await getAiSettings();

  return prisma.aiSettings.update({
    where: { id: settings.id },
    data,
  });
};

module.exports = {
  getAiSettings,
  updateAiSettings,
};