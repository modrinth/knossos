export const patchOrganization = async (orgId, newData) => {
  await useBaseFetch(`organization/${orgId}`, {
    method: 'PATCH',
    body: newData,
    apiVersion: 3,
  })
}
