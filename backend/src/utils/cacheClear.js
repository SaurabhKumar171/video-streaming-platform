const clearTenantCache = async (orgId) => {
  const keys = await client.keys(`__express__${orgId}*`);
  if (keys.length > 0) {
    await client.del(keys);
    console.log(`Cache cleared for Tenant: ${orgId}`);
  }
};
