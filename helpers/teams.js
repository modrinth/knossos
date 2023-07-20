export const acceptTeamInvite = async (teamId) => {
<<<<<<< HEAD
  await useBaseFetch(`team/${teamId}/join`, {
    method: 'POST',
  })
}
export const removeSelfFromTeam = async (teamId) => {
  const auth = await useAuth()
  await removeTeamMember(teamId, auth.user.id)
}
export const removeTeamMember = async (teamId, userId) => {
  await useBaseFetch(`team/${teamId}/members/${userId}`, {
    method: 'DELETE',
=======
  const app = useNuxtApp()
  await useBaseFetch(`team/${teamId}/join`, {
    method: 'POST',
    ...app.$defaultHeaders(),
  })
}
export const removeSelfFromTeam = async (teamId) => {
  const app = useNuxtApp()
  await removeTeamMember(teamId, app.$auth.user.id)
}
export const removeTeamMember = async (teamId, userId) => {
  const app = useNuxtApp()
  await useBaseFetch(`team/${teamId}/members/${userId}`, {
    method: 'DELETE',
    ...app.$defaultHeaders(),
>>>>>>> master
  })
}
