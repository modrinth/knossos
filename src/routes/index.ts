/** @type {import('./__types/index').RequestHandler} */
export async function get() {
	return {
		body: { seed: Math.floor(Math.random() * 10000) },
	}
}
